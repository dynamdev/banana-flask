import { InstancedRigidBodies, InstancedRigidBodyProps, RapierRigidBody, interactionGroups } from '@react-three/rapier'
import React, {  useCallback, useMemo, useRef} from 'react'
import * as THREE from 'three'
import { STORAGE_KEY } from '../constants';
import { BananaInstanceModel } from './models';
// import {  useControls } from 'leva'
// import useDebugStore from '../debug-store';


const BananaInstance = ({ count, startPosition, existingBananas}: {
    count: number;
    startPosition: number;
    existingBananas: number;
  }) => {
    
    const banana = {
      friction:0.5,
      gravityScale:1.5,
      mass:10,
      restitution:0.1,
      collider:'hull'
    }

    // const { bananaBounce } = useDebugStore();

    // const { mass , gravityScale , friction,collider } = useControls({
    //   restitution: bananaBounce,
    //   mass:{ max:30,min:1, step:0.1, value:5},
    //   gravityScale: { max:10,min:1, step:0.1, value:1},
    //   friction: {max:1, min:0.1, step:0.1, value:0.5},
    //   collider: { options: ['hull', 'ball' ,'cuboid'] as const}
    // })
    

    const offset = 20;
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null)
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
   
    const bananaBodyRefs = useRef<(RapierRigidBody | null)[]>([]);

    // const audioRefs = useRef<HTMLAudioElement[]>(
    //  Array.from({ length: count }, () => new Audio("/collision.mp3"))
    // );

    // const audioPlayedFlags = useRef<boolean[]>(Array(count).fill(false));

    const storeBananaPosition = useCallback((i: number) => {

        if (!rigidBodiesRef.current) {
            return;
        }
        const body = rigidBodiesRef.current[i];
       
        if (!body) return;
    
        const position = body.translation();
        const rotation = body.rotation();

        const eulerRotation = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
          "XYZ"
        );
    
        const storedData = localStorage.getItem(STORAGE_KEY);
        const metadata = storedData ? JSON.parse(storedData) : {};
    
        const index = existingBananas + i;
    
        metadata[`banana-${index}`] = {
          position: { x: position.x, y: position.y, z: position.z },
          rotation: {
            x: eulerRotation.x,
            y: eulerRotation.y,
            z: eulerRotation.z,
          },
        };
    
        // Save updated metadata back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
        // countBanana()
    },[existingBananas]);


    const instances = useMemo<InstancedRigidBodyProps[]>(() => {
        return Array.from({ length: count }).map((_, i) => ({
            key:'banana-' + i,
            name:'banana-' + i,
            mass: 5,
            position: [0, startPosition + i * offset , 0.25],
            rotation: [
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
            ],
            onCollisionEnter:() => {
                // if (!audioPlayedFlags.current[i]) {
                //     audioRefs.current[i].pause();
                //     audioRefs.current[i].currentTime = 0;
                //     audioRefs.current[i].play();
                //     audioPlayedFlags.current[i] = true;
                // }
                handleCollisionEnter(i)
            },
            ref: (ref: RapierRigidBody | null) => {
              if (ref) bananaBodyRefs.current[i] = ref; 
            },
            onSleep: () => storeBananaPosition(i),
        }));
   
    }, [count, startPosition, storeBananaPosition]);


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
          
          
          // console.log(linearVelocity);
          // Check if the velocity is above the threshold
          if (velocityMagnitude < velocityThreshold) {
            // rigidBodiesRef.current[index].setEnabled(false)
            rigidBodiesRef.current[index].sleep()
            rigidBodiesRef.current[index].lockRotations(true,false);
            rigidBodiesRef.current[index].lockTranslations(true,false);
            rigidBodiesRef.current[index].setLinvel({ x: 0, y: 0, z: 0 },false);
            rigidBodiesRef.current[index].setAngvel({ x: 0, y: 0, z: 0 },false);

          }
    }

      

    return (
        <InstancedRigidBodies
          gravityScale={banana.gravityScale}
          mass={banana.mass} 
          ref={rigidBodiesRef} 
          instances={instances}  
          colliders="hull"
          restitution={banana.restitution} 
          friction={banana.friction}
          scale={0.225} 
          collisionGroups={interactionGroups(2, [0, 1, 2])}
          
        >
            <BananaInstanceModel ref={instancedMeshRef} count={count}/>
        </InstancedRigidBodies>
    )
}

export default BananaInstance

