import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "./shaders/heatmapVertexShader.glsl";
import fragmentShader from "./shaders/heatmapFragmentShader.glsl";

import kdeData from "../../lib/data/kde.json";

interface HeatmapProps {
  heightScale?: number;
  glowIntensity?: number;
  color?: [number, number, number];
}

export function Heatmap({
  heightScale = 10,
  glowIntensity = 0.5,
  color = [0, 0.5, 1],
}: HeatmapProps) {
  const { size } = useThree();

  const densityTexture = useMemo(() => {
    const width = kdeData.x.length;
    const height = kdeData.y.length;
    const data = new Float32Array(width * height);

    let max = 0;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        max = Math.max(max, kdeData.values[i][j]);
      }
    }

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const flippedI = height - 1 - i;
        data[flippedI * width + j] = kdeData.values[i][j] / max;
      }
    }

    const texture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RedFormat,
      THREE.FloatType,
    );
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    return texture;
  }, []);

  const uniforms = useMemo(
    () => ({
      uDensityMap: { value: densityTexture },
      uHeightScale: { value: heightScale },
      uGlowIntensity: { value: glowIntensity },
      uColor: { value: new THREE.Vector3(...color) },
      uTime: { value: 0 },
    }),
    [densityTexture],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uHeightScale.value = heightScale;
    uniforms.uGlowIntensity.value = glowIntensity;
    uniforms.uColor.value.set(...color);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[105, 68, 100, 68]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
