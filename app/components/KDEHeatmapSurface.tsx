// components/KDEHeatmapSurface.tsx
import { useMemo } from "react";
import * as THREE from "three";
import { Color } from "three";

export interface SoccerKDEData {
  x: number[];
  y: number[];
  values: number[][]; // Array of KDE series
}

interface KDEHeatmapSurfaceProps {
  data: SoccerKDEData;
}

export function KDEHeatmapSurface({ data }: KDEHeatmapSurfaceProps) {
  const meshData = useMemo(() => {
    if (
      !data ||
      !data.x ||
      !data.y ||
      !data.values ||
      data.x.length === 0 ||
      data.y.length === 0
    ) {
      console.warn("KDEHeatmapSurface received incomplete or empty data.");
      return null;
    }

    const primarySeriesValues = data.values[0];
    if (!primarySeriesValues || primarySeriesValues.length === 0) {
      console.warn("KDEHeatmapSurface received empty primary series data.");
      return null;
    }
    const availableDataLength = Math.min(
      data.x.length,
      data.y.length,
      primarySeriesValues.length,
    );

    // --- Variables declared ONCE here, outside the vertex loop ---
    const minRawX = Math.min(...data.x.slice(0, availableDataLength));
    const maxRawX = Math.max(...data.x.slice(0, availableDataLength));
    const minRawY = Math.min(...data.y.slice(0, availableDataLength));
    const maxRawY = Math.max(...data.y.slice(0, availableDataLength));

    let minRawZ = Infinity;
    let maxRawZ = -Infinity;
    primarySeriesValues.slice(0, availableDataLength).forEach((val) => {
      if (val < minRawZ) minRawZ = val;
      if (val > maxRawZ) maxRawZ = val;
    });

    if (maxRawZ === minRawZ) maxRawZ += 1e-9; // Avoid division by zero for flat data

    const gridSegmentsX = 60;
    const gridSegmentsY = 40;

    const fieldWidth = 10;
    const fieldHeight = 6;

    const geometry = new THREE.PlaneGeometry(
      fieldWidth,
      fieldHeight,
      gridSegmentsX,
      gridSegmentsY,
    );
    const positions = geometry.attributes.position.array;
    const colorsArray = new Float32Array(positions.length);

    const colorStart = new Color("#F0F8FF");
    const colorEnd = new Color("#00008b");
    // --- End of one-time variable declarations ---

    // Loop to calculate position and color for each vertex
    for (let i = 0; i < positions.length / 3; i++) {
      const vertexX = positions[i * 3];
      const vertexY = positions[i * 3 + 1];

      // Map vertex position back to the original data's coordinate system
      const mappedX =
        ((vertexX + fieldWidth / 2) / fieldWidth) * (maxRawX - minRawX) +
        minRawX;
      const mappedY =
        ((vertexY + fieldHeight / 2) / fieldHeight) * (maxRawY - minRawY) +
        minRawY;

      // Find the closest KDE data point (nearest-neighbor lookup)
      let closestKdeValue = minRawZ;
      let minDistSq = Infinity;

      for (let j = 0; j < availableDataLength; j++) {
        const dx = data.x[j] - mappedX;
        const dy = data.y[j] - mappedY;
        const distSq = dx * dx + dy * dy;

        if (distSq < minDistSq) {
          minDistSq = distSq;
          closestKdeValue = primarySeriesValues[j];
        }
      }

      // Scale Z height
      const scaledZ = ((closestKdeValue - minRawZ) / (maxRawZ - minRawZ)) * 3;
      positions[i * 3 + 2] = scaledZ;

      // Apply color based on scaled Z
      const normalizedZ = (closestKdeValue - minRawZ) / (maxRawZ - minRawZ);
      const interpolatedColor = colorStart.clone().lerp(colorEnd, normalizedZ);
      colorsArray[i * 3] = interpolatedColor.r;
      colorsArray[i * 3 + 1] = interpolatedColor.g;
      colorsArray[i * 3 + 2] = interpolatedColor.b;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));
    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 2); // Rotate to be flat on the XZ plane (Y-up by default)

    return geometry;
  }, [data]);

  if (!meshData) {
    return null;
  }

  return (
    <mesh geometry={meshData}>
      <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} />
    </mesh>
  );
}
