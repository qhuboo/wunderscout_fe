"use client";

import { VisualizationType } from "../types/types";

import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Logo from "./Logo";
import HeatmapTerrain from "./HeatmapTerrain";
import { ComponentType } from "react";

extend({ AxesHelper: THREE.AxesHelper });

type VizProps = { data?: unknown };

const visualizationComponents = {
  kde: HeatmapTerrain,
  histogram: HeatmapTerrain,
  logo: Logo,
} as const satisfies Record<VisualizationType, ComponentType<VizProps>>;

export default function ThreeScene({
  visualizationType,
  data,
}: {
  visualizationType: VisualizationType;
  data?: unknown;
}) {
  const SelectedVisualization = visualizationComponents[visualizationType];

  return (
    <Canvas
      camera={{ position: [0, 80, 80], fov: 75 }}
      style={{
        width: "100%",
        height: "100%",
        background: "#202020",
      }}
    >
      <directionalLight />
      <axesHelper args={[5]} />
      <OrbitControls />
      <SelectedVisualization data={data} />
    </Canvas>
  );
}
