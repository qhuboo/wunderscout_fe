import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "./shaders/sphereVertexShader.glsl";
import fragmentShader from "./shaders/sphereFragmentShader.glsl";

interface VaporWaveUniforms {
  uTime: { value: number };
  uResolution: { value: THREE.Vector2 };
  uCameraWorldMatrix: { value: THREE.Matrix4 };
  [uniform: string]: { value: any };
}

export const Raymarcher = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, camera } = useThree();

  const uniforms = useMemo<VaporWaveUniforms>(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uCameraWorldMatrix: { value: new THREE.Matrix4() },
    }),
    [size.width, size.height],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      materialRef.current.uniforms.uResolution.value.set(
        state.size.width,
        state.size.height,
      );

      materialRef.current.uniforms.uCameraWorldMatrix.value.copy(
        camera.matrixWorld,
      );
    }
  });

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <rawShaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};
