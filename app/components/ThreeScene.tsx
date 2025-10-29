"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BasicCube() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        width: "100%",
        height: "100%",
        background: "#333",
      }}
    >
      <ambientLight intensity={0.5} />
      <BasicCube />
    </Canvas>
  );
}
