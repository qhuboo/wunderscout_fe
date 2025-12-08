"use client";

import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

import { Raymarcher } from "./Raymarcher";
import { Heatmap } from "./Heatmap";
import Plane from "./Plane";

import heatmapDataRaw from "../../lib/data/kde.json";
import { HeatmapData } from "../types/types";
const heatmapData = heatmapDataRaw as HeatmapData;

import HeatmapTerrain from "./HeatmapTerrain";

extend({ AxesHelper: THREE.AxesHelper });

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
      <directionalLight />
      <axesHelper args={[5]} />
      <OrbitControls />
      <HeatmapTerrain data={heatmapData} />
    </Canvas>
  );
}
