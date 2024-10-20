import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { BananaModel } from "./models";
import { STORAGE_KEY } from "../constants";

function RenderBananas({
  count,
  startPosition,
  existingBananas,
}: {
  count: number;
  startPosition: number;
  existingBananas: number;
}) {
  const offset = 5;
  const bananaBodyRefs = useRef<(RapierRigidBody | null)[]>(
    Array(count).fill(null)
  );
  const audioRefs = useRef<HTMLAudioElement[]>(
    Array.from({ length: count }, () => new Audio("/collision.mp3"))
  );
  const audioPlayedFlags = useRef<boolean[]>(Array(count).fill(false));

  function storeBananaPosition(i: number) {
    const body = bananaBodyRefs.current[i];

    if (!body) return;

    const position = body.translation();
    const rotation = body.rotation();

    const storedData = localStorage.getItem(STORAGE_KEY);
    const metadata = storedData ? JSON.parse(storedData) : {};

    const index = existingBananas + i;
    metadata[`banana-${index}`] = {
      position: { x: position.x, y: position.y, z: position.z },
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
        w: rotation.w,
      },
    };

    // Save updated metadata back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        return (
          <RigidBody
            key={`banana-${i}`}
            colliders="hull"
            restitution={0.001}
            mass={5}
            ref={(ref) => {
              bananaBodyRefs.current[i] = ref;
            }}
            onCollisionEnter={() => {
              // Only play the sound once per object
              if (!audioPlayedFlags.current[i]) {
                audioRefs.current[i].play();
                audioPlayedFlags.current[i] = true;
              }
            }}
            onSleep={() => storeBananaPosition(i)}
            position={[0, startPosition + i * offset, 0.25]}
            rotation={[
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
            ]}
          >
            <BananaModel />
          </RigidBody>
        );
      })}
    </>
  );
}

export default RenderBananas;
