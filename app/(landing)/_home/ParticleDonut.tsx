"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

export default function Component() {
  return (
    <div className=" absolute pointer-events-none -z-10 inset-0 w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 0], fov: 55 }}>
        <Sparkles speed={0.3} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
}
