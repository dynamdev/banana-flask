type BananaData = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
};

export type BananaMetadata = {
  [key: string]: BananaData;
};
