"use client";

import { Canvas } from "@react-three/fiber";
import { FlaskModel } from "@/app/components/models";
import { Suspense } from "react";
import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import RenderBananas from "./components/banana-renderer";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full h-full bg-gray-100">
        <Canvas camera={{ position: [100, 100, 100], zoom: 5 }}>
          <Suspense>
            <Physics gravity={[0, -9.8, 0]}>
              <OrthographicCamera />
              <Environment files="/modern_bathroom_1k.hdr" />
              <ambientLight intensity={0.3} />
              <directionalLight position={[100, 100, 100]} intensity={2.5} />
              <OrbitControls enableZoom />

              <RenderBananas count={10} startPosition={50} />

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
