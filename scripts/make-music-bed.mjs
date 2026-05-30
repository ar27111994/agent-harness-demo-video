import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const sampleRate = 44100;
const seconds = 90;
const channels = 2;
const frames = sampleRate * seconds;
const outputPath = join("public", "audio", "agent-harness-uplift-bed.wav");

function envelope(t) {
  const fadeIn = Math.min(1, t / 4);
  const fadeOut = Math.min(1, (seconds - t) / 7);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

function noteFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function softTone(t, midi, gain) {
  const f = noteFrequency(midi);
  return (
    (Math.sin(2 * Math.PI * f * t) * 0.58 +
      Math.sin(2 * Math.PI * f * 2 * t) * 0.18 +
      Math.sin(2 * Math.PI * f * 0.5 * t) * 0.24) *
    gain
  );
}

function pluck(t, start, midi, gain) {
  const local = t - start;
  if (local < 0 || local > 1.8) return 0;
  const decay = Math.exp(-local * 2.6);
  const attack = Math.min(1, local / 0.04);
  return softTone(local, midi, gain * decay * attack);
}

const chords = [
  [50, 57, 62, 66],
  [45, 52, 57, 61],
  [47, 54, 59, 62],
  [43, 50, 55, 59],
];
const lead = [74, 76, 78, 81, 78, 76, 74, 71];
const pcm = Buffer.alloc(frames * channels * 2);

for (let i = 0; i < frames; i += 1) {
  const t = i / sampleRate;
  const bar = Math.floor(t / 4) % chords.length;
  const chord = chords[bar];
  const env = envelope(t);
  let sample = 0;

  for (const note of chord) {
    sample += softTone(t, note, 0.045);
  }

  const beat = Math.floor(t * 2);
  const beatStart = beat / 2;
  sample += pluck(t, beatStart, lead[beat % lead.length], 0.05);
  sample += pluck(t, beatStart + 0.25, lead[(beat + 3) % lead.length], 0.025);

  const shimmer =
    Math.sin(2 * Math.PI * 880 * t) * Math.sin(2 * Math.PI * 0.07 * t) * 0.01;
  sample = (sample + shimmer) * env;

  const left = Math.max(-1, Math.min(1, sample * 0.88));
  const right = Math.max(
    -1,
    Math.min(
      1,
      sample * 0.78 + Math.sin(2 * Math.PI * 0.11 * t) * sample * 0.08,
    ),
  );
  pcm.writeInt16LE(Math.round(left * 32767), i * 4);
  pcm.writeInt16LE(Math.round(right * 32767), i * 4 + 2);
}

function wavHeader(dataLength) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * 2, 28);
  header.writeUInt16LE(channels * 2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataLength, 40);
  return header;
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, Buffer.concat([wavHeader(pcm.length), pcm]));
await writeFile(
  join("public", "audio", "ATTRIBUTION.md"),
  `# Audio attribution\n\n- \`agent-harness-uplift-bed.wav\` is an original generated instrumental bed created locally for this Remotion demo on ${new Date().toISOString()}.\n- No third-party samples, loops, or copyrighted recordings were used.\n- Intended to sit quietly under narration; keep low in the mix.\n`,
);
