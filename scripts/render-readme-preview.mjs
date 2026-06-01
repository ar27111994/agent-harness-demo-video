import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import ffmpegPath from "ffmpeg-static";

const { env } = globalThis.process;
const { console } = globalThis;

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceVideo = env.README_PREVIEW_SOURCE
  ? join(repoRoot, env.README_PREVIEW_SOURCE)
  : join(repoRoot, "out", "agent-harness-product-demo.mp4");
const outputGif = env.README_PREVIEW_OUTPUT
  ? join(repoRoot, env.README_PREVIEW_OUTPUT)
  : join(repoRoot, "media", "readme", "agent-harness-readme-preview.gif");

const segmentDurationSeconds = 2.6;
const fadeDurationSeconds = 0.45;
const previewWidth = 840;
const previewFps = 12;
const playButtonSize = 126;
const segmentStartsSeconds = [0, 26, 43, 74];

if (!ffmpegPath) {
  throw new Error("ffmpeg-static did not resolve an ffmpeg binary path.");
}

if (!existsSync(sourceVideo)) {
  throw new Error(
    `Source video not found at ${sourceVideo}. Run npm run render first, or set README_PREVIEW_SOURCE.`,
  );
}

await mkdir(dirname(outputGif), { recursive: true });

const segmentFilters = segmentStartsSeconds.map((start, index) => {
  return `[0:v]trim=start=${start}:duration=${segmentDurationSeconds},setpts=PTS-STARTPTS,scale=${previewWidth}:-2:flags=lanczos,fps=${previewFps},format=yuv420p[v${index}]`;
});

const xfadeOffsets = segmentStartsSeconds.slice(1).map((_, index) => {
  const outputDurationBeforeNext =
    segmentDurationSeconds +
    index * (segmentDurationSeconds - fadeDurationSeconds);
  return Number((outputDurationBeforeNext - fadeDurationSeconds).toFixed(2));
});

const xfadeFilters = [
  `[v0][v1]xfade=transition=fade:duration=${fadeDurationSeconds}:offset=${xfadeOffsets[0]}[x1]`,
  `[x1][v2]xfade=transition=fade:duration=${fadeDurationSeconds}:offset=${xfadeOffsets[1]}[x2]`,
  [
    `[x2][v3]xfade=transition=fade:duration=${fadeDurationSeconds}:offset=${xfadeOffsets[2]}`,
    "format=rgba",
    `drawbox=x=(w-${playButtonSize})/2:y=(h-${playButtonSize})/2:w=${playButtonSize}:h=${playButtonSize}:color=black@0.42:t=fill`,
    "drawtext=text='▶':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=(h-text_h)/2-4",
    "drawtext=text='Click for sound-on walkthrough':fontcolor=white:fontsize=28:box=1:boxcolor=black@0.55:boxborderw=14:x=(w-text_w)/2:y=h-76",
    "split[gifsrc][paletteSrc]",
  ].join(","),
  `[paletteSrc]palettegen=stats_mode=diff[palette]`,
  `[gifsrc][palette]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
];

const args = [
  "-y",
  "-i",
  sourceVideo,
  "-filter_complex",
  [...segmentFilters, ...xfadeFilters].join(";"),
  "-loop",
  "0",
  outputGif,
];

await run(ffmpegPath, args);
console.log(`Wrote ${outputGif}`);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `ffmpeg exited after signal ${signal}`
            : `ffmpeg exited with code ${code}`,
        ),
      );
    });
  });
}
