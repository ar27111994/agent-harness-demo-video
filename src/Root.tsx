import "./index.css";

import { Composition } from "remotion";

import { AgentHarnessDemo } from "./Composition";
import { videoMeta } from "./story";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AgentHarnessProductDemo"
      component={AgentHarnessDemo}
      durationInFrames={videoMeta.durationInSeconds * videoMeta.fps}
      fps={videoMeta.fps}
      width={videoMeta.width}
      height={videoMeta.height}
    />
  );
};
