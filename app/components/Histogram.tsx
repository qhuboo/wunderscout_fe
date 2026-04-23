import * as THREE from "three";
import { useMemo } from "react";
import { HistogramData } from "../types/types";

import vertexShader from "./shaders/histogramVertexShader.glsl";
import fragmentShader from "./shaders/histogramFragmentShader.glsl";

export default function Histogram({ data }: { data?: unknown }) {
  const histogramData = data as HistogramData;

  const { dataTexture, binsX, binsY } = useMemo(() => {
    if (!histogramData || !histogramData.values.length) {
      return { dataTexture: null, binsX: 0, binsY: 0 };
    }

    const bX = histogramData.xedges.length - 1;
    const bY = histogramData.yedges.length - 1;

    const size = bX * bY;
    const textureData = new Float32Array(4 * size);

    const flatValues = histogramData.values.flat();
    const maxVal = Math.max(...flatValues) || 1.0;

    for (let i = 0; i < size; i++) {
      const stride = i * 4;
      const val = flatValues[i] || 0;
      textureData[stride] = val / maxVal;
      textureData[stride + 1] = 0.0;
      textureData[stride + 2] = 0.0;
      textureData[stride + 3] = 1.0;
    }

    const texture = new THREE.DataTexture(
      textureData,
      bX,
      bY,
      THREE.RGBAFormat,
      THREE.FloatType,
    );

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    return { dataTexture: texture, binsX: bX, binsY: bY };
  }, [data]);

  const uniforms = useMemo(
    () => ({
      uDataTexture: { value: dataTexture },
      uBins: { value: new THREE.Vector2(binsX, binsY) },
    }),
    [dataTexture, binsX, binsY],
  );

  if (!dataTexture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[105, 68, binsX * 2, binsY * 2]} />
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
