import { InstancedRigidBodies, InstancedRigidBodyProps, RapierRigidBody, interactionGroups } from '@react-three/rapier'
import React, {  useCallback, useMemo, useRef} from 'react'
import * as THREE from 'three'
import { STORAGE_KEY } from '../constants';
import { BananaInstanceModel } from './models';


const BananaInstance = ({ count, startPosition, existingBananas}: {
    count: number;
    startPosition: number;
    existingBananas: number;
  }) => {
    
    const offset = 20;
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null)
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
   
    
    const bananaBodyRefs = useRef<(RapierRigidBody | null)[]>([]);

    const audioRefs = useRef<HTMLAudioElement[]>(
     Array.from({ length: count }, () => new Audio("/collision.mp3"))
    );

    const audioPlayedFlags = useRef<boolean[]>(Array(count).fill(false));

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
                    audioRefs.current[i].pause();
                    audioRefs.current[i].currentTime = 0;
                    audioRefs.current[i].play();
                    audioPlayedFlags.current[i] = true;
                }
            },
            // ref: (ref: RapierRigidBody) => (bananaBodyRefs.current[i] = ref),
            ref: (ref: RapierRigidBody | null) => {
              if (ref) bananaBodyRefs.current[i] = ref; // Set each ref by index
            },
            onSleep: () => storeBananaPosition(i),
        }));
   
    }, [count, startPosition, storeBananaPosition]);

    
    // const [countBelowThreshold, setCountBelowThreshold ] = useState(0);
    // const [ hasCrossed, setHasCrossed ] = useState(Array(count).fill(false));

    // useFrame(() => {
    //   if (!rigidBodiesRef.current) return;
      
    //   const bananas = rigidBodiesRef.current;

    //   const newCrossed = bananas.map((banana,index) => {
    //     if(banana.translation().y < 0 && !hasCrossed[index]){
    //       return true;
    //     }
    //     return hasCrossed[index];
    //   })

    //   const newCount = newCrossed.filter(crossed => crossed).length;
    //   setCountBelowThreshold(newCount);
    //   setHasCrossed(newCrossed);
    //   console.log(newCount);

    //   // const allBelow = rigidBodiesRef.current.every(body => body.translation().y < 100);
    //   // console.log(allBelow);

    //   // for (let i = 0; i < count; i++) { 
    //   //   const { y } = rigidBodiesRef.current[i].translation();
    //   //   if(y > 98 && y < 100){
    //   //     console.log(rigidBodiesRef.current[i])
    //   //     return;
    //   //   }
    //   //   return
    //   // }
    // });

    return (
        <InstancedRigidBodies 
          ref={rigidBodiesRef} 
          instances={instances}  
          colliders="hull" 
          restitution={0.001} 
          scale={0.225} 
          collisionGroups={interactionGroups(2, [0, 1, 2])}
        >
            <BananaInstanceModel ref={instancedMeshRef} count={count}/>
        </InstancedRigidBodies>
    )
}

export default BananaInstance

