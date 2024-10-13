"use client";

import { Canvas } from "@react-three/fiber";
import { BananaModel, FlaskModel } from "@/app/components/models";
import { Suspense } from "react";
import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[40rem] h-[40rem] bg-gray-100">
        <Canvas camera={{ position: [100, 100, 100], zoom: 5 }}>
          <Suspense>
            <OrthographicCamera />
            <Environment files="/trekker_monument_1k.hdr" />
            <ambientLight intensity={5} />
            <directionalLight position={[100, 100, 100]} intensity={1} />
            <OrbitControls enableZoom />
            <BananaModel />
            <FlaskModel />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
