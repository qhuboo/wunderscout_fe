import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface RaymarcherProps {
  glowIntensity?: number;
  sphereSpeed?: number;
  sphereColor?: [number, number, number];
}

export function Raymarcher({
  glowIntensity = 0.14,
  sphereSpeed = 1,
  sphereColor = [0, 0.25, 1],
}: RaymarcherProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFloorAngle: { value: 0 },
      uSphereAngle: { value: 0 },
      uGlowIntensity: { value: glowIntensity },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uSphereColor: { value: new THREE.Vector3(...sphereColor) },
      uCameraPosition: { value: new THREE.Vector3() },
      uCameraMatrix: { value: new THREE.Matrix4() },
    }),
    [],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uSphereAngle.value += delta * sphereSpeed;
    uniforms.uGlowIntensity.value = glowIntensity;
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uSphereColor.value.set(...sphereColor);
    uniforms.uCameraPosition.value.copy(camera.position);
    uniforms.uCameraMatrix.value.copy(camera.matrixWorld);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}
