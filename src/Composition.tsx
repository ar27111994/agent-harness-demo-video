import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  commandGroups,
  communityPrompts,
  configurationRows,
  enrichmentArtifacts,
  feedbackChannels,
  hostAdapters,
  lifecyclePhases,
  outputTree,
  productPromise,
  safetyBoundaries,
  terminalTranscript,
} from "./story";

const palette = {
  background: "#030711",
  panel: "rgba(7, 13, 28, 0.88)",
  panelStrong: "rgba(9, 17, 35, 0.96)",
  border: "rgba(148, 163, 184, 0.22)",
  muted: "#9fb1c8",
  text: "#f3f8ff",
  cyan: "#5ee7ff",
  blue: "#7c8cff",
  violet: "#b58cff",
  green: "#6ee7a8",
  amber: "#ffd166",
  red: "#ff7380",
};

const fontStack =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
const monoStack = "JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, monospace";
const totalFrames = 2700;
const fadeDuration = 24;

const scenes = {
  hero: { start: 0, end: 280 },
  lifecycle: { start: 300, end: 690 },
  terminal: { start: 710, end: 1190 },
  config: { start: 1210, end: 1530 },
  artifacts: { start: 1550, end: 1870 },
  safety: { start: 1890, end: 2210 },
  community: { start: 2230, end: totalFrames },
} as const;

export const AgentHarnessDemo: React.FC = () => (
  <AbsoluteFill style={styles.root}>
    <Audio
      src={staticFile("audio/agent-harness-uplift-bed.wav")}
      volume={(frame) =>
        interpolate(frame, [0, 45, 2520, 2700], [0, 0.105, 0.105, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio
      src={staticFile("voiceover/agent-harness-demo-voiceover.mp3")}
      volume={(frame) =>
        interpolate(frame, [0, 30, 2530, 2605], [0, 0.94, 0.94, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
      endAt={2625}
    />
    <BackgroundSystem />
    <SceneWindow start={scenes.hero.start} end={scenes.hero.end}>
      <HeroScene />
    </SceneWindow>
    <SceneWindow start={scenes.lifecycle.start} end={scenes.lifecycle.end}>
      <LifecycleScene />
    </SceneWindow>
    <SceneWindow start={scenes.terminal.start} end={scenes.terminal.end}>
      <TerminalScene />
    </SceneWindow>
    <SceneWindow start={scenes.config.start} end={scenes.config.end}>
      <ConfigScene />
    </SceneWindow>
    <SceneWindow start={scenes.artifacts.start} end={scenes.artifacts.end}>
      <ArtifactsScene />
    </SceneWindow>
    <SceneWindow start={scenes.safety.start} end={scenes.safety.end}>
      <SafetyScene />
    </SceneWindow>
    <SceneWindow start={scenes.community.start} end={scenes.community.end}>
      <CommunityScene />
    </SceneWindow>
    <ProgressRail />
  </AbsoluteFill>
);

const SceneWindow: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({
  start,
  end,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, start, end);
  const y = interpolate(frame, [start, start + 42], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity, transform: `translate3d(0, ${y}px, 0)` }}>
      {children}
    </AbsoluteFill>
  );
};

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heroSpring = spring({ frame, fps, config: { damping: 26, stiffness: 86, mass: 0.9 } });
  const scan = interpolate(frame, [80, 220], [-420, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={styles.heroScene}>
      <div style={styles.heroLeft}>
        <Kicker>Agent asset lifecycle for real repositories</Kicker>
        <h1 style={{ ...styles.heroTitle, transform: `scale(${0.94 + heroSpring * 0.06})` }}>
          agent-harness
        </h1>
        <p style={styles.heroSubtitle}>
          Discover, recommend, mirror, stage, activate, and wire reusable agent context without hiding the review step.
        </p>
        <div style={styles.heroCommand}>
          <span>$</span> agent-harness workspace opencode --intent general
        </div>
      </div>
      <div style={styles.heroRight}>
        <div style={styles.repoCard}>
          <div style={styles.repoTopline}>
            <span>workspace</span>
            <strong>community-demo</strong>
          </div>
          <div style={{ ...styles.scanBeam, transform: `translateX(${scan}px)` }} />
          {productPromise.map((item, index) => {
            const reveal = interpolate(frame, [56 + index * 28, 92 + index * 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={item} style={{ ...styles.promiseRow, opacity: reveal }}>
                <span style={styles.promiseDot}>{index + 1}</span>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LifecycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [scenes.lifecycle.start + 42, scenes.lifecycle.end - 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={styles.sceneShell}>
      <SceneHeader
        eyebrow="Reviewable lifecycle"
        title="One pipeline, eight inspectable handoffs"
        body="The second beat is now a compact lifecycle map instead of a clipped wall of cards. Each phase leaves state you can inspect before the host is wired."
      />
      <div style={styles.lifecycleCanvas}>
        <div style={styles.lifecycleTrack}>
          <div style={{ ...styles.lifecycleFill, width: `${progress * 100}%` }} />
        </div>
        {lifecyclePhases.map((phase, index) => {
          const x = 44 + index * 205;
          const y = index % 2 === 0 ? 68 : 248;
          const reveal = interpolate(frame, [scenes.lifecycle.start + 38 + index * 20, scenes.lifecycle.start + 72 + index * 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={phase.label}
              style={{
                ...styles.lifecycleNode,
                left: x,
                top: y,
                opacity: 0.82 + reveal * 0.18,
                transform: `translateY(${(1 - reveal) * 18}px)`,
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{phase.label}</strong>
              <small>{phase.detail}</small>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const visibleLines = Math.min(
    terminalTranscript.length,
    Math.max(1, Math.floor((frame - scenes.terminal.start - 20) / 17)),
  );

  return (
    <AbsoluteFill style={styles.splitScene}>
      <div style={styles.leftNarrative}>
        <SceneHeader
          eyebrow="Real CLI surface"
          title="The CLI surface is broad, inspectable, and real"
          body="Start with the help surface, then follow a public-safe OpenCode workspace run through discovery, recommendations, mirror locks, staging, activation, and wire previews."
        />
        <CommandFamilyGrid />
      </div>
      <TerminalWindow lines={terminalTranscript.slice(0, visibleLines)} />
    </AbsoluteFill>
  );
};

const ConfigScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={styles.splitScene}>
      <div style={styles.leftNarrative}>
        <SceneHeader
          eyebrow="Configuration + AI enrichment"
          title="Optional intelligence, visible controls"
          body="AI enrichment is a controlled mode with explicit origin allowlists, redacted keys, and output artifacts you can review."
        />
        <div style={styles.configTable}>
          {configurationRows.map(([key, value], index) => {
            const reveal = interpolate(frame, [scenes.config.start + 34 + index * 22, scenes.config.start + 58 + index * 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={key} style={{ ...styles.configRow, opacity: reveal }}>
                <code>{key}</code>
                <strong>{value}</strong>
              </div>
            );
          })}
        </div>
      </div>
      <div style={styles.enrichmentPanel}>
        <div style={styles.enrichmentBadge}>AI enrichment output</div>
        {enrichmentArtifacts.map((artifact, index) => {
          const reveal = interpolate(frame, [scenes.config.start + 100 + index * 34, scenes.config.start + 128 + index * 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={artifact} style={{ ...styles.artifactMini, opacity: reveal }}>
              <span>{artifact.endsWith("input.json") ? "in" : "ai"}</span>
              <code>{artifact}</code>
            </div>
          );
        })}
        <div style={styles.enrichmentSummary}>
          <div style={styles.summaryCard}><strong>manual</strong><small>human-triggered enrichment</small></div>
          <div style={styles.summaryCard}><strong>allowlisted</strong><small>network origins are explicit</small></div>
          <div style={styles.summaryCard}><strong>reviewable</strong><small>AI outputs become files</small></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ArtifactsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={styles.sceneShell}>
      <SceneHeader
        eyebrow="Evidence board"
        title="The result is files, not vibes"
        body="Demand profiles, source indexes, recommendations, bundle locks, activation manifests, and wire previews are visible outputs."
      />
      <div style={styles.artifactBoard}>
        {outputTree.map((path, index) => {
          const reveal = interpolate(frame, [scenes.artifacts.start + 32 + index * 18, scenes.artifacts.start + 56 + index * 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={path} style={{ ...styles.artifactItem, opacity: reveal }}>
              <span style={styles.fileGlyph}>{path.endsWith(".md") ? "md" : "{}"}</span>
              <code>{path}</code>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SafetyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={styles.splitScene}>
      <div style={styles.leftNarrative}>
        <SceneHeader
          eyebrow="Trust boundaries"
          title="Automation should earn trust, not bypass it"
          body="The spacing bug is fixed here: each principle has a separate label and explanation, because trust details should not visually run together."
        />
        <div style={styles.quarantineBox}>Preview → approve → apply → reset</div>
      </div>
      <div style={styles.securityPanel}>
        {safetyBoundaries.map((boundary, index) => {
          const reveal = interpolate(frame, [scenes.safety.start + 40 + index * 38, scenes.safety.start + 64 + index * 38], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={boundary.label} style={{ ...styles.safetyRow, opacity: reveal }}>
              <span style={styles.checkBadge}>✓</span>
              <div style={styles.safetyText}>
                <strong>{boundary.label}</strong>
                <small>{boundary.detail}</small>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CommunityScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={styles.sceneShell}>
      <SceneHeader
        eyebrow="Adapters + community loop"
        title="Seven host adapters, real feedback wanted"
        body="Host support is now shown as registered adapters with visual marks. Shared CLI workflows are treated as an ecosystem note, not a fake adapter."
      />
      <div style={styles.communityLayout}>
        <div style={styles.hostGrid}>
          {hostAdapters.map((host, index) => {
            const reveal = interpolate(frame, [scenes.community.start + 30 + index * 14, scenes.community.start + 54 + index * 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return <HostCard key={host.id} host={host} opacity={reveal} />;
          })}
        </div>
        <div style={styles.feedbackPanel}>
          {communityPrompts.map((prompt, index) => {
            const reveal = interpolate(frame, [scenes.community.start + 116 + index * 30, scenes.community.start + 140 + index * 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={prompt} style={{ ...styles.feedbackQuestion, opacity: reveal }}>
                <span>→</span>
                {prompt}
              </div>
            );
          })}
          <div style={styles.feedbackChannels}>
            {feedbackChannels.map((channel) => (
              <span key={channel} style={styles.channelPill}>
                {channel}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.closeLine}>agent-harness: portable agent context, improved in public.</div>
    </AbsoluteFill>
  );
};

const HostCard: React.FC<{ host: (typeof hostAdapters)[number]; opacity: number }> = ({ host, opacity }) => (
  <div style={{ ...styles.hostCard, opacity }}>
    <div style={styles.hostLogos}>
      {host.icons.map((icon) => (
        <Img key={icon} src={staticFile(`brand/hosts/${icon}`)} style={styles.hostLogo} />
      ))}
    </div>
    <div style={styles.hostText}>
      <strong>{host.label}</strong>
      <code>{host.command}</code>
    </div>
  </div>
);

const CommandFamilyGrid: React.FC = () => (
  <div style={styles.commandFamilyGrid}>
    {commandGroups.map((group) => (
      <div key={group.title} style={styles.commandFamily}>
        <strong>{group.title}</strong>
        {group.commands.slice(0, 4).map((command) => (
          <code key={command}>{command}</code>
        ))}
      </div>
    ))}
  </div>
);

const BackgroundSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, totalFrames], [0, -140]);
  const glow = interpolate(frame, [0, totalFrames], [0, 360]);

  return (
    <AbsoluteFill style={styles.background}>
      <div style={styles.noiseLayer} />
      <div style={{ ...styles.gridLayer, transform: `translate3d(${drift}px, ${drift / 2}px, 0)` }} />
      <div style={{ ...styles.glowA, transform: `rotate(${glow}deg) translateX(80px)` }} />
      <div style={{ ...styles.glowB, transform: `rotate(${-glow * 0.6}deg) translateX(-110px)` }} />
      <div style={styles.vignette} />
    </AbsoluteFill>
  );
};

const TerminalWindow: React.FC<{ lines: readonly string[] }> = ({ lines }) => (
  <div style={styles.terminalWindow}>
    <div style={styles.terminalChrome}>
      <span style={{ ...styles.chromeDot, backgroundColor: palette.red }} />
      <span style={{ ...styles.chromeDot, backgroundColor: palette.amber }} />
      <span style={{ ...styles.chromeDot, backgroundColor: palette.green }} />
      <span style={styles.terminalTitle}>agent-harness-demo</span>
    </div>
    <div style={styles.terminalBody}>
      {lines.slice(-17).map((line, index) => (
        <div key={`${line}-${index}`} style={lineStyle(line)}>
          {line || " "}
        </div>
      ))}
      <span style={styles.cursor}>█</span>
    </div>
  </div>
);

const SceneHeader: React.FC<{ eyebrow: string; title: string; body: string }> = ({ eyebrow, title, body }) => (
  <div style={styles.sceneHeader}>
    <Kicker>{eyebrow}</Kicker>
    <h2 style={styles.sceneTitle}>{title}</h2>
    <p style={styles.sceneBody}>{body}</p>
  </div>
);

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={styles.kicker}>{children}</div>;

const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, totalFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={styles.progressTrack}>
      <div style={{ ...styles.progressFill, width: `${width}%` }} />
    </div>
  );
};

function sceneOpacity(frame: number, start: number, end: number): number {
  const fadeIn = interpolate(frame, [start, start + fadeDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - fadeDuration, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return Math.min(fadeIn, fadeOut);
}

function lineStyle(line: string): React.CSSProperties {
  if (line.startsWith("$")) return { ...styles.terminalLine, color: palette.cyan, fontWeight: 800 };
  if (line.includes("Complete")) return { ...styles.terminalLine, color: palette.green };
  if (line.includes("commands:")) return { ...styles.terminalLine, color: palette.amber };
  return styles.terminalLine;
}

const styles: Record<string, React.CSSProperties> = {
  root: { backgroundColor: palette.background, color: palette.text, fontFamily: fontStack, overflow: "hidden" },
  background: {
    background:
      "radial-gradient(circle at 18% 12%, rgba(94,231,255,0.18), transparent 30%), radial-gradient(circle at 82% 70%, rgba(181,140,255,0.20), transparent 34%), linear-gradient(135deg, #030711 0%, #081121 55%, #050812 100%)",
  },
  gridLayer: {
    position: "absolute",
    inset: -180,
    backgroundImage:
      "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
    maskImage: "linear-gradient(to bottom, transparent, black 18%, black 78%, transparent)",
  },
  noiseLayer: {
    position: "absolute",
    inset: 0,
    opacity: 0.08,
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 4px)",
  },
  glowA: {
    position: "absolute",
    width: 580,
    height: 580,
    left: 90,
    top: 70,
    borderRadius: 999,
    background: "radial-gradient(circle, rgba(94,231,255,0.18), transparent 62%)",
    filter: "blur(12px)",
  },
  glowB: {
    position: "absolute",
    width: 760,
    height: 760,
    right: 20,
    bottom: -60,
    borderRadius: 999,
    background: "radial-gradient(circle, rgba(124,140,255,0.18), transparent 68%)",
    filter: "blur(18px)",
  },
  vignette: { position: "absolute", inset: 0, boxShadow: "inset 0 0 250px rgba(0,0,0,0.78)" },
  heroScene: { padding: "118px 128px", flexDirection: "row", alignItems: "center", gap: 90 },
  heroLeft: { width: 980 },
  heroRight: { flex: 1, display: "flex", justifyContent: "center" },
  kicker: { color: palette.cyan, fontSize: 21, letterSpacing: 4.2, textTransform: "uppercase", fontWeight: 850, marginBottom: 22 },
  heroTitle: { margin: 0, fontSize: 132, lineHeight: 0.95, letterSpacing: -6, fontWeight: 940, transformOrigin: "left center" },
  heroSubtitle: { margin: "30px 0 0", color: "#c6d7eb", fontSize: 34, lineHeight: 1.26, fontWeight: 560, maxWidth: 900 },
  heroCommand: {
    marginTop: 42,
    display: "inline-flex",
    gap: 16,
    padding: "20px 28px",
    border: "1px solid rgba(110,231,168,0.34)",
    borderRadius: 20,
    background: "linear-gradient(135deg, rgba(7,17,31,0.96), rgba(8,25,36,0.84))",
    color: palette.green,
    fontFamily: monoStack,
    fontSize: 24,
    boxShadow: "0 32px 80px rgba(0,0,0,0.38)",
  },
  repoCard: {
    position: "relative",
    width: 620,
    padding: 34,
    border: `1px solid ${palette.border}`,
    borderRadius: 34,
    background: palette.panelStrong,
    overflow: "hidden",
    boxShadow: "0 42px 130px rgba(0,0,0,0.48)",
  },
  repoTopline: { display: "flex", justifyContent: "space-between", color: palette.muted, fontSize: 22, marginBottom: 26 },
  scanBeam: { position: "absolute", top: 0, bottom: 0, width: 120, background: "linear-gradient(90deg, transparent, rgba(94,231,255,0.14), transparent)" },
  promiseRow: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    padding: "19px 0",
    borderBottom: "1px solid rgba(148,163,184,0.13)",
    color: "#e7f2ff",
    fontSize: 25,
    fontWeight: 720,
  },
  promiseDot: { width: 40, height: 40, borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(94,231,255,0.13)", color: palette.cyan, fontFamily: monoStack },
  sceneShell: { padding: "92px 112px" },
  splitScene: { padding: "92px 112px", flexDirection: "row", alignItems: "center", gap: 70 },
  leftNarrative: { width: 710, flexShrink: 0 },
  sceneHeader: { maxWidth: 1200 },
  sceneTitle: { margin: 0, maxWidth: 1120, fontSize: 60, lineHeight: 1.04, letterSpacing: -2.3, fontWeight: 890 },
  sceneBody: { margin: "22px 0 0", maxWidth: 1040, color: palette.muted, fontSize: 25, lineHeight: 1.34, fontWeight: 540 },
  lifecycleCanvas: { position: "relative", marginTop: 46, height: 430, border: `1px solid ${palette.border}`, borderRadius: 34, background: "rgba(7,13,28,0.62)", overflow: "hidden" },
  lifecycleTrack: { position: "absolute", left: 114, right: 114, top: 222, height: 4, borderRadius: 999, background: "rgba(148,163,184,0.18)" },
  lifecycleFill: { height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${palette.cyan}, ${palette.violet}, ${palette.green})`, boxShadow: "0 0 30px rgba(94,231,255,0.48)" },
  lifecycleNode: { position: "absolute", width: 178, padding: 18, border: `1px solid ${palette.border}`, borderRadius: 22, background: "rgba(9,17,35,0.94)", boxShadow: "0 24px 70px rgba(0,0,0,0.32)", display: "flex", flexDirection: "column", gap: 7 },
  terminalWindow: { flex: 1, height: 720, border: `1px solid ${palette.border}`, borderRadius: 32, overflow: "hidden", background: "rgba(2,7,18,0.96)", boxShadow: "0 44px 130px rgba(0,0,0,0.52)" },
  terminalChrome: { height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1px solid ${palette.border}`, background: "linear-gradient(90deg, rgba(15,23,42,0.94), rgba(15,32,48,0.74))" },
  chromeDot: { width: 14, height: 14, borderRadius: 999 },
  terminalTitle: { marginLeft: 18, color: palette.muted, fontFamily: monoStack, fontSize: 17 },
  terminalBody: { padding: 26, fontFamily: monoStack, fontSize: 23, lineHeight: 1.5 },
  terminalLine: { minHeight: 33, color: "#d7e5f5", whiteSpace: "pre-wrap" },
  cursor: { color: palette.cyan },
  commandFamilyGrid: { marginTop: 34, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  commandFamily: { padding: 18, border: `1px solid ${palette.border}`, borderRadius: 20, background: "rgba(7,13,28,0.70)", display: "flex", flexDirection: "column", gap: 8 },
  configTable: { marginTop: 36, border: `1px solid ${palette.border}`, borderRadius: 26, overflow: "hidden", background: "rgba(7,13,28,0.72)" },
  configRow: { display: "flex", flexDirection: "column", gap: 8, padding: "16px 22px", borderBottom: "1px solid rgba(148,163,184,0.12)", fontSize: 20 },
  enrichmentPanel: { flex: 1, padding: 36, border: `1px solid rgba(94,231,255,0.30)`, borderRadius: 34, background: "linear-gradient(145deg, rgba(8,13,27,0.94), rgba(9,25,38,0.80))", boxShadow: "0 36px 110px rgba(0,0,0,0.40)" },
  enrichmentBadge: { display: "inline-flex", marginBottom: 26, padding: "12px 16px", borderRadius: 999, background: "rgba(94,231,255,0.12)", color: palette.cyan, fontSize: 20, fontWeight: 820 },
  artifactMini: { display: "flex", gap: 18, alignItems: "center", padding: "20px 0", borderBottom: "1px solid rgba(148,163,184,0.13)", fontSize: 22 },
  enrichmentSummary: { marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 },
  summaryCard: { display: "flex", flexDirection: "column", gap: 8, padding: 16, border: "1px solid rgba(148,163,184,0.16)", borderRadius: 18, background: "rgba(7,13,28,0.48)" },
  artifactBoard: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 42 },
  artifactItem: { display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", border: `1px solid ${palette.border}`, borderRadius: 20, background: "rgba(7,13,28,0.78)", fontSize: 18, minHeight: 76 },
  fileGlyph: { width: 40, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 13, color: palette.cyan, background: "rgba(94,231,255,0.12)", fontFamily: monoStack, fontSize: 14, flexShrink: 0 },
  securityPanel: { flex: 1, padding: 36, border: `1px solid ${palette.border}`, borderRadius: 32, background: palette.panelStrong, boxShadow: "0 38px 115px rgba(0,0,0,0.42)" },
  safetyRow: { display: "flex", alignItems: "flex-start", gap: 20, padding: "18px 0", borderBottom: "1px solid rgba(148,163,184,0.13)" },
  checkBadge: { width: 42, height: 42, borderRadius: 999, display: "inline-flex", justifyContent: "center", alignItems: "center", background: "rgba(110,231,168,0.14)", color: palette.green, fontWeight: 900, flexShrink: 0 },
  safetyText: { display: "flex", flexDirection: "column", gap: 8, fontSize: 25, lineHeight: 1.16 },
  quarantineBox: { marginTop: 38, padding: 28, borderRadius: 24, background: "rgba(255,209,102,0.10)", border: "1px solid rgba(255,209,102,0.32)", color: "#ffe7ac", fontSize: 31, fontWeight: 820 },
  communityLayout: { display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 30, marginTop: 40 },
  hostGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  hostCard: { minHeight: 104, padding: 20, border: `1px solid ${palette.border}`, borderRadius: 23, background: palette.panel, display: "flex", alignItems: "center", gap: 18, boxShadow: "0 22px 70px rgba(0,0,0,0.25)" },
  hostLogos: { width: 92, minHeight: 58, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0, borderRadius: 18, background: "#f8fafc" },
  hostLogo: { maxWidth: 38, maxHeight: 38, objectFit: "contain" },
  hostText: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  feedbackPanel: { padding: 28, border: `1px solid rgba(94,231,255,0.28)`, borderRadius: 30, background: "linear-gradient(145deg, rgba(8,13,27,0.92), rgba(8,25,36,0.76))" },
  feedbackQuestion: { display: "flex", alignItems: "center", gap: 16, padding: "16px 0", color: "#e7f2ff", fontSize: 24, lineHeight: 1.24, borderBottom: "1px solid rgba(148,163,184,0.12)" },
  feedbackChannels: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 },
  channelPill: { padding: "10px 13px", border: `1px solid ${palette.border}`, borderRadius: 999, background: "rgba(94,231,255,0.10)", color: "#d7edff", fontSize: 17, fontWeight: 760 },
  closeLine: { marginTop: 34, color: palette.cyan, fontSize: 28, fontWeight: 850, textAlign: "center" },
  progressTrack: { position: "absolute", left: 64, right: 64, bottom: 42, height: 4, borderRadius: 999, background: "rgba(148,163,184,0.18)" },
  progressFill: { height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${palette.cyan}, ${palette.violet}, ${palette.green})`, boxShadow: "0 0 22px rgba(94,231,255,0.42)" },
};
