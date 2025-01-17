/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 flask.glb --types --transform 
Files: flask.glb [8.89KB] > C:\Users\hashi\OneDrive\Desktop\3D models\flask-transformed.glb [7.25KB] (18%)
*/

import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    pCylinder4: THREE.Mesh;
  };
  materials: {
    ["Glass.001"]: THREE.MeshStandardMaterial;
  };
};

export function FlaskModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/flask-transformed.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.pCylinder4.geometry}
        material={materials["Glass.001"]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={10}
      />
    </group>
  );
}

useGLTF.preload("/flask-transformed.glb");
