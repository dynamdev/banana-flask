import React from "react";
import { BananaModel } from "./models";

const STORAGE_KEY = "Banana_metadata";

function ExistingBananas() {
  const existingBananaMetadata = localStorage.getItem(STORAGE_KEY);

  if (!existingBananaMetadata) return null;

  const parsedMetadata = JSON.parse(existingBananaMetadata);

  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => {
        const { position, rotation } = parsedMetadata[`banana-${i}`];
        console.log(position);
        return (
          <BananaModel
            position={[position.x, position.y, position.z]}
            rotation={[rotation.x, rotation.y, rotation.z]}
          />
        );
      })}
    </>
  );
}

export default ExistingBananas;
