import * as THREE from "three";
import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { InstancedMesh } from "three";

type GLTFResult = GLTF & {
  nodes: {
    Cube002: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

export function BananaModel (props: JSX.IntrinsicElements["group"]) {
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


type BananaInstanceModelProps = {
  count: number;
} & JSX.IntrinsicElements["instancedMesh"];


export const BananaInstanceModel = forwardRef<InstancedMesh, BananaInstanceModelProps>((props,ref) => {
  const { nodes, materials } = useGLTF("/banana-transformed.glb") as unknown as  GLTFResult

  return (
    <instancedMesh
      ref={ref}
      frustumCulled={false} 
      args={[nodes.Cube002.geometry, materials["Material.001"], props.count]}
      {...props} 
    />
  );
})
BananaInstanceModel.displayName = "BananaInstanceModel";



useGLTF.preload("/banana-transformed.glb");
