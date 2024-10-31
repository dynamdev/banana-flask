"use client";

import { Canvas } from "@react-three/fiber";
import { FlaskModel } from "@/app/components/models";
import { Suspense, useEffect, useState } from "react";
import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import {CuboidCollider, Physics, RigidBody, interactionGroups } from "@react-three/rapier";
import TogglePlayButton from "./components/buttons/toggle-play";
import BananaCountForm from "./components/forms/banana-count";
import { BananaMetadata } from "./types/banana-metadata";
import {
  DEFAULT_BANANA_COUNT,
  START_BANANA_POSITION,
  STORAGE_KEY,
} from "./constants";
import BananaInstance from "./components/banana-instance";
import ExistingBananas from "./components/existing-bananas";
import useStore from "./store";


export default function Home() {
  const [play, setPlay] = useState<boolean>(false);
  const [count, setCount] = useState<number>(DEFAULT_BANANA_COUNT);
  const [existingBananas,setExistingBananas] = useState<BananaMetadata>({});
  const {newBananaCount,countBanana,oldBananaCount, setNewBananaCount} = useStore();

  function togglePlay() {
    setPlay((prev) => !prev);
    if(!play){ 
      setNewBananaCount(newBananaCount)
    }
    else{
      setNewBananaCount(newBananaCount - count)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageData = localStorage.getItem(STORAGE_KEY);
      setExistingBananas(storageData ? JSON.parse(storageData) : []);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
       <div className="text-black bg-white p-3 text-center fixed top-4 flex flex-col z-50">
        <p>
          Total:  {newBananaCount + oldBananaCount}
        </p>
       </div>

      <div className="flex items-center space-x-4 fixed top-4 md:right-4 z-50">
        <BananaCountForm
          onSubmit={(newCount: number) => {
            setCount(newCount);
            togglePlay();
          }}
          count={count}
        />
        <TogglePlayButton onClick={togglePlay} play={play} />
      </div>

      <div className="w-full h-full bg-gray-100">
        <Canvas camera={{ position: [100, 100, 100], zoom: 5 }}>
          <Suspense>
        
            <Environment 
              // files="/modern_bathroom_1k.hdr"
              preset="forest" 
            />

            <OrthographicCamera />

            <directionalLight position={[100, 100, 100]} intensity={1} />
            
            <ambientLight intensity={0.1} />

            <OrbitControls enableZoom />

            <Physics gravity={[0, -9.8, 0]}>
              <RigidBody position={[0,10,0]}>
                <CuboidCollider
                  args={[1, 0, 1]}
                  sensor
                  onIntersectionExit={() => countBanana()}
                />
              </RigidBody>

              <ExistingBananas existingBananas={existingBananas} />

              {play ? (
                <BananaInstance
                  count={count}
                  startPosition={START_BANANA_POSITION}
                  existingBananas={Object.keys(existingBananas).length}
                />
              ) : null}

              <RigidBody type="fixed" colliders="trimesh" restitution={0} friction={0} collisionGroups={interactionGroups(0, [1, 2])}>
                <FlaskModel position={[0, -0.5, 0]} />
              </RigidBody>
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
