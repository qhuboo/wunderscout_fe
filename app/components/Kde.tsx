import * as THREE from "three";
import { useMemo } from "react";
import { KdeData } from "../types/types";

import vertexShader from "./shaders/kdeVertexShader.glsl";
import fragmentShader from "./shaders/kdeFragmentShader.glsl";

export default function Kde({ data }: { data?: unknown }) {
  const heatmapData = data as KdeData;

  const dataTexture = useMemo(() => {
    const width = heatmapData.x.length;
    const height = heatmapData.y.length;
    const size = width * height;

    const textureData = new Float32Array(4 * size);
    const flatValues = heatmapData.values.flat();
    const maxVal = Math.max(...flatValues) || 1.0;

    for (let i = 0; i < size; i++) {
      const stride = i * 4;
      const intensity = flatValues[i] / maxVal;

      textureData[stride] = intensity;
      textureData[stride + 1] = 0.0;
      textureData[stride + 2] = 0.0;
      textureData[stride + 3] = 1.0;
    }

    const texture = new THREE.DataTexture(
      textureData,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType,
    );

    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return texture;
  }, [data]);

  // Create uniforms object to pass data to shaders
  // useMemo prevents re-creating this object every render
  const uniforms = useMemo(
    () => ({
      uDataTexture: {
        value: dataTexture,
      },
    }),
    [dataTexture],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry
        args={[105, 68, heatmapData.x.length - 1, heatmapData.y.length - 1]}
      />
      <rawShaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </mesh>
  );
}
