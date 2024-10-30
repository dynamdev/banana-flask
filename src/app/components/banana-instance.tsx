import { InstancedRigidBodies, InstancedRigidBodyProps, RapierRigidBody, interactionGroups } from '@react-three/rapier'
import React, {  useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { STORAGE_KEY } from '../constants';
import { useFrame } from '@react-three/fiber';
import useStore from "../store";

type GLTFResult = GLTF & {
    nodes: {
      Cube002: THREE.Mesh;
    };
    materials: {
      ["Material.001"]: THREE.MeshStandardMaterial;
    };
  };

const BananaInstance = ({ count, startPosition, existingBananas}: {
    count: number;
    startPosition: number;
    existingBananas: number;
  }) => {
    
    const [ isRunning,setIsRunning] = useState(false);
    const offset = 20;
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null)
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
    const { setNewBananaCount, setOutsideBananaCount } = useStore()
    
    const bananaBodyRefs = useRef<(RapierRigidBody | null)[]>(
        Array(count).fill(null)
    );

    const audioRefs = useRef<HTMLAudioElement[]>(
     Array.from({ length: count }, () => new Audio("/collision.mp3"))
    );

    const audioPlayedFlags = useRef<boolean[]>(Array(count).fill(false));

   async function storeBananaPosition(i: number) {

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
       
    }


    const instances = useMemo<InstancedRigidBodyProps[]>(() => {
        return Array.from({ length: count }).map((_, i) => ({
            key: 'banana-' + i,
            restitution: 0.001,
            mass: 5,
            position: [0, startPosition + i * offset , 0.25],
            rotation: [
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
            ],
            onCollisionEnter:() => {
                if (!audioPlayedFlags.current[i]) {
                    audioRefs.current[i].play();
                    audioPlayedFlags.current[i] = true;
                }
            },
            ref: async (ref: RapierRigidBody | null) => (bananaBodyRefs.current[i] = ref),
            onSleep: () => storeBananaPosition(i),
        }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, startPosition]);

    

    useFrame(() => {
      if (instancedMeshRef.current) {
        const newPositions = [];
        const position = new THREE.Vector3();
        const matrix = new THREE.Matrix4();
  
        for (let i = 0; i < count; i++) {
          // instancedMeshRef.current.getMatrixAt(i, matrix); 
          matrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3()); 
          newPositions.push(position.clone()); 


          for(let j = 0; j < newPositions.length ; j++){
            if(newPositions[j].y > 98 && newPositions[j].y < 100){
              
              setNewBananaCount((j + 1));
              setOutsideBananaCount(count - (j - 1));

              // const bananaString = localStorage.getItem('banana-metadata')

              // if(bananaString){
            
              //   const oldBanana = JSON.parse(bananaString);
                
              //   setOldBananaCount(Object.keys(oldBanana).length)
                
              // }
             
            }
          }
        }
      }
    });
    
    const { nodes, materials } = useGLTF("/banana-transformed.glb") as unknown  as GLTFResult;

    return (
        <InstancedRigidBodies 
          ref={rigidBodiesRef} 
          instances={instances}  
          colliders="hull" 
          restitution={0.001} 
          scale={0.225} 
          collisionGroups={interactionGroups(2, [0, 1, 2])}
        >
            <instancedMesh ref={instancedMeshRef} args={[nodes.Cube002.geometry, materials["Material.001"], count]}  count={count} />
        </InstancedRigidBodies>
    )
}

export default BananaInstance


useGLTF.preload("/banana-transformed.glb");