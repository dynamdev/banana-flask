import React from "react";
import { BananaModel } from "./models";
import { STORAGE_KEY } from "../constants";
import { BananaMetadata } from "../types/banana-metadata";

type Props = {
  existingBananas: BananaMetadata;
};
function ExistingBananas({ existingBananas }: Props) {
  return (
    <>
      {Object.entries(existingBananas).map(([key, bananaData]) => {
        const { position, rotation } = bananaData;

        return (
          <BananaModel
            key={key}
            position={[position.x, position.y, position.z]}
            rotation={[rotation.x, rotation.y, rotation.z]}
          />
        );
      })}
    </>
  );
}

export default ExistingBananas;
