"use client";

import { Canvas } from "@react-three/fiber";
import { FlaskModel } from "@/app/components/models";
import { FormEvent, Suspense, useState } from "react";
import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import RenderBananas from "./components/banana-renderer";
import TogglePlayButton from "./components/buttons/toggle-play";
import BananaCountForm from "./components/forms/banana-count";

export default function Home() {
  const [play, setPlay] = useState<boolean>(false);
  const [count, setCount] = useState<number>(20);

  function togglePlay() {
    setPlay((prev) => !prev);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex items-center space-x-4 fixed top-4 right-4 z-50">
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
            <Physics gravity={[0, -9.8, 0]}>
              <OrthographicCamera />
              <Environment files="/modern_bathroom_1k.hdr" />
              <ambientLight intensity={0.3} />
              <directionalLight position={[100, 100, 100]} intensity={2.5} />
              <OrbitControls enableZoom />

              {play ? <RenderBananas count={count} startPosition={30} /> : null}

              <RigidBody type="fixed" colliders={"trimesh"} restitution={0.01}>
                <FlaskModel position={[0, 0, 0]} />
              </RigidBody>
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
