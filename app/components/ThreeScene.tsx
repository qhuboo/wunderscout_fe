"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
// Import the KDEHeatmapSurface component and its associated data type
import { KDEHeatmapSurface, SoccerKDEData } from "./KDEHeatmapSurface";
import * as THREE from "three";

interface ThreeSceneProps {
  data: SoccerKDEData; // ThreeScene still expects SoccerKDEData as its main prop
}

export default function ThreeScene({ data }: ThreeSceneProps) {
  // Check if data is valid for rendering
  const hasData = data && data.x && data.y && data.values && data.x.length > 0;

  return (
    <Canvas
      camera={{ position: [0, 15, 15], fov: 75 }} // Camera positioned to view a horizontal surface
      style={{
        width: "100%",
        height: "100%",
        background: "#202020", // Dark background
      }}
    >
      {/* General Three.js Scene Elements (apply to almost any scene) */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Grid Helper from Drei (general scene helper) */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        sectionSize={5}
        sectionColor={new THREE.Color("gray")}
        sectionThickness={1.5}
        fadeDistance={50}
        fadeStrength={1}
      />

      {/* OrbitControls from Drei (general interaction helper) */}
      <OrbitControls />

      {/* --- Specific Visualization Component --- */}
      {/* Conditionally render the KDEHeatmapSurface if valid data is provided */}
      {hasData ? (
        <KDEHeatmapSurface data={data} /> // This is where the heatmap is rendered
      ) : (
        // Fallback or loading indicator if no data
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </Canvas>
  );
}
