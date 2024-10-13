import { RigidBody } from "@react-three/rapier";
import React, { useState } from "react";
import { BananaModel } from "./models";

import { VolumeX, Volume } from "lucide-react";

function RenderBananas({
  count,
  startPosition,
}: {
  count: number;
  startPosition: number;
}) {
  const offset = 5;
  const [audio] = useState<HTMLAudioElement[]>(() =>
    Array.from({ length: count }, () => new Audio("/collision.mp3"))
  );

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        let isAudioPlayed: boolean = false;
        return (
          <RigidBody
            key={`banana-${i}`}
            colliders="hull"
            restitution={0.001}
            mass={5}
            onCollisionEnter={() => {
              if (!isAudioPlayed) {
                audio[i].play();
                isAudioPlayed = true;
              }
            }}
          >
            <BananaModel
              position={[0, startPosition + i * offset, 0.25]}
              rotation={[
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
              ]}
            />
          </RigidBody>
        );
      })}
    </>
  );
}

export default RenderBananas;
