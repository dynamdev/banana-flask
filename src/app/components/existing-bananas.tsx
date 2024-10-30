import React, { Suspense,  useEffect, useMemo, useRef } from "react";
// import { BananaModel } from "./models";
// import { STORAGE_KEY } from "../constants";
import { BananaMetadata } from "../types/banana-metadata";
import {  InstancedRigidBodies, InstancedRigidBodyProps, RapierRigidBody, interactionGroups} from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from 'three';

type Props = {
  existingBananas: BananaMetadata;

};

type GLTFResult = GLTF & {
  nodes: {
    Cube002: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};


function ExistingBananas({ existingBananas}: Props) {
  const rigidBodiesRef = useRef<RapierRigidBody[]>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const instances = useMemo<InstancedRigidBodyProps[]>(() => {
    return Object.entries(existingBananas).map(([key, bananaData])  => ({
        key: key,
        name:key,
        restitution: 0,
        friction:0,
        position:[bananaData.position.x, bananaData.position.y, bananaData.position.z],
        rotation:[bananaData.rotation.x, bananaData.rotation.y, bananaData.rotation.z],
    }));
  }, [existingBananas]);

  useEffect(() => {
    if (instancedMeshRef.current) {
      instances.forEach((instance, i) => {
        const matrix = new THREE.Matrix4();
        matrix.compose(
          new THREE.Vector3(...(instance.position as [number, number, number])),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(...instance.rotation as [number, number, number], "XYZ")),
          new THREE.Vector3(0.225, 0.225, 0.225) 
        );
        instancedMeshRef.current?.setMatrixAt(i, matrix);
        
        const translation = new THREE.Vector3();
        translation.setFromMatrixPosition(matrix);

        if (rigidBodiesRef.current) rigidBodiesRef.current[i]?.setTranslation(translation,false)
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [instances]);

  useEffect(() => {
    if (!rigidBodiesRef.current) {
      return;
    }

    const lastIndex = rigidBodiesRef.current.length - 1;
    const InActive = lastIndex - 3;
    
    rigidBodiesRef.current.forEach((body, i) => {
      if (body) {
        if(i < InActive){
          body.setEnabled(false);
          body.isSleeping(); 
          body.lockRotations(true,false);
          body.lockTranslations(true,false);
        }else{
          body.isSleeping(); 
          body.lockRotations(false,false);
          body.lockTranslations(false,false);
          body.setAngvel(new THREE.Vector3(0,0,0),false)
          body.setLinvel(new THREE.Vector3(0,0,0),false)
        }
        
      }
    });
  }, []);

  const { nodes, materials } = useGLTF("/banana-transformed.glb") as unknown as GLTFResult;

  return (
    <Suspense fallback="loading">  
       <InstancedRigidBodies 
          instances={instances}
          ref={rigidBodiesRef}
          colliders="cuboid"
          restitution={0} 
          scale={0.225} 
          friction={0}
          collisionGroups={interactionGroups(1, [0, 2, 1])}
        >
          <instancedMesh 
            ref={instancedMeshRef}
            args={[nodes.Cube002.geometry, materials["Material.001"], instances.length]} 
            count={instances.length}
          />
        </InstancedRigidBodies>
    </Suspense>
  )
}

export default ExistingBananas;



useGLTF.preload("/banana-transformed.glb");