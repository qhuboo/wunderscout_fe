"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 15, 15], fov: 75 }}
      style={{
        width: "100%",
        height: "100%",
        background: "#202020",
      }}
    >
      {/* General Three.js Scene Elements*/}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* OrbitControls from Drei (general interaction helper) */}
      <OrbitControls />

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Canvas>
  );
}
