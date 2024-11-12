import React, { Suspense,  useEffect, useMemo, useRef } from "react";
import { BananaMetadata } from "../types/banana-metadata";
import {  InstancedRigidBodies, InstancedRigidBodyProps, RapierRigidBody, interactionGroups} from "@react-three/rapier";
import * as THREE from 'three';
import useStore  from "../store";
import { BananaInstanceModel } from "./models";

type Props = {
  existingBananas: BananaMetadata;
};

function ExistingBananas({ existingBananas}: Props) {
  const rigidBodiesRef = useRef<RapierRigidBody[]>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const { setOldBananaCount,actionStatus } = useStore();

  const instances = useMemo<InstancedRigidBodyProps[]>(() => {
    return Object.entries(existingBananas).map(([key, bananaData],index)  => ({
        key: key,
        name:key,
        restitution: 0,
        friction:0,
        position:[bananaData.position.x, bananaData.position.y, bananaData.position.z],
        rotation:[bananaData.rotation.x, bananaData.rotation.y, bananaData.rotation.z],
        onCollisionEnter:() => {
          handleCollisionEnter(index)
        }
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
        setOldBananaCount(i + 1);  
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [instances,setOldBananaCount]);

  useEffect(() => {
    if (!rigidBodiesRef.current) {
      return;
    }

    const lastIndex = rigidBodiesRef.current.length - 1;
    const InActive = lastIndex - 8;
    
    if(actionStatus === 'play'){
      rigidBodiesRef.current.forEach((body,i) => {
        if (body) {
          if(i < InActive){
            body.sleep();
            body.lockRotations(true,false);
            body.lockTranslations(true,false);
          }
          else{
            body.wakeUp()
            body.setAngularDamping(0.5);
            body.setAngvel(new THREE.Vector3(0), true);
            body.lockRotations(false,false);
            body.lockTranslations(false,false);
          }
        }
      });
    }else{
      rigidBodiesRef.current.forEach((body) => {
        if (body) {
            body.isSleeping(); 
            body.lockRotations(true,false);
            body.lockTranslations(true,false);
        }
      });
    }
  }, [actionStatus]);

  const handleCollisionEnter = (index:number) => {

    if (!rigidBodiesRef.current) {
      return;
    }

    const velocityThreshold = 0.5;
    
    const linearVelocity = rigidBodiesRef.current[index].linvel();
    const velocityMagnitude = Math.sqrt(
        linearVelocity.x * linearVelocity.x +
        linearVelocity.y * linearVelocity.y +
        linearVelocity.z * linearVelocity.z
    );
 
    if (velocityMagnitude < velocityThreshold) {
      rigidBodiesRef.current[index].sleep()
      rigidBodiesRef.current[index].lockRotations(true,false);
      rigidBodiesRef.current[index].lockTranslations(true,false);
      rigidBodiesRef.current[index].setLinvel({ x: 0, y: 0, z: 0 },false);
      rigidBodiesRef.current[index].setAngvel({ x: 0, y: 0, z: 0 },false);
    }
  }


  return (
    <Suspense fallback="loading">  
       <InstancedRigidBodies 
          instances={instances}
          ref={rigidBodiesRef}
          colliders="cuboid"
          linearDamping={1}  
          angularDamping={1}
          restitution={1}
          friction={0.5}
          scale={0.225} 
          collisionGroups={interactionGroups(1, [0, 2, 1])}
        >
           <BananaInstanceModel ref={instancedMeshRef} count={instances.length}/>
        </InstancedRigidBodies>
    </Suspense>
  )
}

export default ExistingBananas;



