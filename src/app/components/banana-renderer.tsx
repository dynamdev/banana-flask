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
  const offset = 50;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        return (
          <RigidBody colliders="cuboid" restitution={0.01}>
            <BananaModel position={[0, startPosition + i * offset, 0.25]} />
          </RigidBody>
        );
      })}
    </>
  );
}

export default RenderBananas;
