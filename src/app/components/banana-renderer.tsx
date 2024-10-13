import { RigidBody } from "@react-three/rapier";
import React from "react";
import { BananaModel } from "./models";

function RenderBananas({
  count,
  startPosition,
}: {
  count: number;
  startPosition: number;
}) {
  const offset = 5;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        return (
          <RigidBody colliders="hull" restitution={0.001} mass={5}>
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
