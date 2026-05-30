export const videoMeta = {
  title: "agent-harness",
  subtitle: "Portable agent context, built for review and community feedback",
  durationInSeconds: 90,
  fps: 30,
  width: 1920,
  height: 1080,
};

export const productPromise = [
  "Discover reusable agent assets",
  "Recommend what fits this workspace",
  "Mirror + stage reviewable state",
  "Activate only after explicit trust",
] as const;

export const lifecyclePhases = [
  { label: "Demand", detail: "workspace signals + intent" },
  { label: "Sources", detail: "trusted source packs" },
  { label: "Catalog", detail: "skills, prompts, tools, hooks" },
  { label: "Recommend", detail: "ranked with reasons" },
  { label: "Mirror", detail: "repeatable bundle locks" },
  { label: "Stage", detail: "project-local files" },
  { label: "Activate", detail: "manifest before writes" },
  { label: "Wire", detail: "host adapter preview" },
] as const;

export const hostAdapters = [
  {
    id: "vscode",
    label: "VS Code + Copilot",
    command: "workspace vscode",
    icons: ["visualstudiocode.svg", "githubcopilot.svg"],
  },
  { id: "opencode", label: "OpenCode", command: "workspace opencode", icons: ["opencode-wordmark.svg"] },
  { id: "cursor", label: "Cursor", command: "workspace cursor", icons: ["cursor.svg"] },
  { id: "zed", label: "Zed", command: "workspace zed", icons: ["zedindustries.svg"] },
  { id: "claude", label: "Claude Code", command: "workspace claude-code", icons: ["claude.svg"] },
  { id: "pi", label: "Pi", command: "workspace pi", icons: ["pi-wordmark.svg"] },
  { id: "codex", label: "OpenAI Codex", command: "workspace codex", icons: ["openai.svg"] },
] as const;

export const commandGroups = [
  {
    title: "Discover",
    commands: ["discover demand-profile", "discover sources", "discover sync", "discover catalog", "discover select", "discover enrich"],
  },
  {
    title: "Recommend",
    commands: ["recommend report", "recommend ai-review", "recommend explain", "recommend evaluate"],
  },
  {
    title: "Mirror + Stage",
    commands: ["mirror plan", "mirror locks", "mirror acquire", "stage bundle", "stage native", "stage diff"],
  },
  {
    title: "Activate + Wire",
    commands: ["activate host", "activate rollback", "wire opencode", "wire cursor", "wire zed", "setup doctor"],
  },
] as const;

export const terminalTranscript = [
  "$ agent-harness help",
  "agent-harness commands:",
  "  discover full        demand, sources, sync, catalog, select",
  "  discover enrich      bounded optional AI enrichment",
  "  recommend report     recompute recommendation report",
  "  recommend ai-review  recommendation-native AI review",
  "  mirror locks         generate repeatable bundle locks",
  "  stage bundle         stage mirrored assets locally",
  "  activate host        materialize active host views",
  "  wire opencode        preview/apply/reset host wire-in",
  "",
  "$ agent-harness workspace opencode --intent general",
  "[workspace] 1/11 Scanning workspace demand...",
  "[workspace] 2/11 Refreshing source index...",
  "[workspace] 3/11 Syncing indexed sources...",
  "[workspace] 4/11 Refreshing source index after sync...",
  "[workspace] 5/11 Building discovery catalog...",
  "[workspace] 6/11 Applying selection rules...",
  "[workspace] 7/11 Ranking recommendations...",
  "[workspace] 8/11 Planning mirror work...",
  "[workspace] 9/11 Preparing mirror locks...",
  "[workspace] 10/11 Acquiring and staging assets...",
  "[workspace] 11/11 Activating host views...",
  "[workspace opencode] Complete. Review .agent-harness/ and .opencode outputs.",
] as const;

export const configurationRows = [
  ["AGENT_HARNESS_AI_ENRICHMENT_MODE", "manual"],
  ["AGENT_HARNESS_AI_ENRICHMENT_ALLOWED_ORIGINS", "https://api.openai.com"],
  ["AGENT_HARNESS_AI_ENRICHMENT_API_KEY", "***"],
  ["--state-root", ".agent-harness"],
  ["--no-dotenv", "supported"],
] as const;

export const enrichmentArtifacts = [
  ".agent-harness/discover/output/ai-enrichment-input.json",
  ".agent-harness/discover/output/ai-enrichment.json",
  ".agent-harness/recommend/output/ai-review.json",
] as const;

export const outputTree = [
  ".agent-harness/discover/output/demand-profile.json",
  ".agent-harness/discover/output/source-index.json",
  ".agent-harness/discover/output/selection-report.json",
  ".agent-harness/state/recommendations.json",
  ".agent-harness/mirror/bundles/opencode-global.lock.json",
  ".agent-harness/activate/opencode/activation-manifest.json",
  ".agent-harness/activate/opencode/wire-preview-opencode.json",
  ".opencode/context/project-intelligence/agent-harness/wire-plan.json",
  "AGENTS.md",
] as const;

export const safetyBoundaries = [
  { label: "Preview first", detail: "project-local writes stay reviewable before trust" },
  { label: "Explicit trust", detail: "quarantine approval is never silent" },
  { label: "No surprise installs", detail: "native tools and logins remain user decisions" },
  { label: "Policy visible", detail: "environment overrides and state roots stay inspectable" },
  { label: "Optional intelligence", detail: "AI enrichment can be manual or disabled" },
] as const;

export const communityPrompts = [
  "Which host adapter should be hardened next?",
  "Which catalogs are missing from real workspaces?",
  "Which safety checks would make this trustworthy?",
  "Where are recommendations noisy or wrong?",
] as const;

export const feedbackChannels = ["GitHub issues", "GitHub discussions", "adapter requests", "workspace reports"] as const;

export const voiceoverScript = `agent-harness is for developers who are tired of copying agent prompts and setup files by hand.

It gives reusable agent assets a lifecycle you can inspect.

Start from a clean workspace. Ask the harness to prepare an OpenCode setup, and it shows demand signals, source choices, recommendations, mirrored bundles, activation manifests, and wire previews before you trust the result.

The point is not magic. It is reviewable state. You can diff it, reset it, and decide what belongs in your project.

High-risk steps stay visible: native installs, authentication, quarantine approval, hooks, plugins, tools, and MCP servers remain explicit choices.

The same lifecycle can support Visual Studio Code and Copilot, OpenCode, Cursor, Zed, Claude Code, Pi, Codex, and shared command-line workflows.

This release is also a call for feedback. Try it on a real workspace. Tell us where the host adapters feel rough, which asset catalogs should be added, and what safety checks would make you trust it more.

agent-harness: portable agent context, built to be reviewed, challenged, and improved with the community.`;
