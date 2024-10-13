import { RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { BananaModel } from "./models";

function RenderBananas({
  count,
  startPosition,
}: {
  count: number;
  startPosition: number;
}) {
  const offset = 5;
  const audioRefs = useRef<HTMLAudioElement[]>(
    Array.from({ length: count }, () => new Audio("/collision.mp3"))
  );
  const audioPlayedFlags = useRef<boolean[]>(Array(count).fill(false));

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        return (
          <RigidBody
            key={`banana-${i}`}
            colliders="hull"
            restitution={0.001}
            mass={5}
            onCollisionEnter={() => {
              // Only play the sound once per object
              if (!audioPlayedFlags.current[i]) {
                audioRefs.current[i].play();
                audioPlayedFlags.current[i] = true;
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
