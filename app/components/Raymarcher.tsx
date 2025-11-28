// Raymarcher.tsx
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface RaymarcherProps {
  glowIntensity?: number;
  floorSpeed?: number;
  sphereSpeed?: number;
  sphereColor?: [number, number, number];
  floorPattern?: "circles" | "grid";
}

export function Raymarcher({
  glowIntensity = 0.14,
  floorSpeed = 0.1,
  sphereSpeed = 1,
  sphereColor = [0, 0.25, 1],
  floorPattern = "circles",
}: RaymarcherProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFloorAngle: { value: 0 },
      uSphereAngle: { value: 0 },
      uGlowIntensity: { value: glowIntensity },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uSphereColor: { value: new THREE.Vector3(...sphereColor) },
      uFloorPattern: { value: floorPattern === "grid" ? 1 : 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uFloorAngle.value += delta * floorSpeed;
    uniforms.uSphereAngle.value += delta * sphereSpeed;
    uniforms.uGlowIntensity.value = glowIntensity;
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uSphereColor.value.set(...sphereColor);
    uniforms.uFloorPattern.value = floorPattern === "grid" ? 1 : 0;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
