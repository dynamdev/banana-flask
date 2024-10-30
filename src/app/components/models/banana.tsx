import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube002: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

export function BananaModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/banana-transformed.glb") as GLTFResult;
  
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cube002.geometry}
        material={materials["Material.001"]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.225}
      />
    </group>
  );
}

useGLTF.preload("/banana-transformed.glb");
