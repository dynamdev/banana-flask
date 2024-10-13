"use client";

import { Canvas } from "@react-three/fiber";
import { BananaModel, FlaskModel } from "@/app/components/models";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-96 h-96 bg-gray-100">
        <Canvas>
          <Suspense>
            <ambientLight intensity={1} />
            <OrbitControls enableZoom />
            <BananaModel />
            <FlaskModel />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
