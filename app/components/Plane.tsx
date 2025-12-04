import * as THREE from "three";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Plane() {
  const materialRef = useRef(null);

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
  };

  useFrame((state) => {
    if (materialRef.current !== null) {
      (materialRef.current as any).uniforms.u_time.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <rawShaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
