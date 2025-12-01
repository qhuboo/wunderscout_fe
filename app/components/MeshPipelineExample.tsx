import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

const vertexGLSL = `
uniform float progress;   // 0..1
uniform float radius;     // dome radius

varying float vHeight;

// Dome function: z = sqrt(R^2 - x^2 - y^2), else 0
float domeZ(vec2 xy, float R) {
  float r2 = dot(xy, xy);
  return r2 <= R*R ? sqrt(R*R - r2) : 0.0;
}

void main() {
  // Base plane (-1..1 range assumed by geometry below)
  vec3 base = position;

  // Height for "heatmap-like" state (just a simple ripple)
  float heat = 0.3 * sin(3.14159265 * base.x) * cos(3.14159265 * base.y);

  // Dome (sphere cap)
  float d = domeZ(base.xy, radius);

  // Morph: 0 = plane+heat, 1 = dome
  float z = mix(heat, d, progress);

  vHeight = z;
  vec3 finalPos = vec3(base.xy, z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentGLSL = `
precision highp float;
varying float vHeight;

void main() {
  // Simple color based on height
  vec3 color = mix(vec3(0.1, 0.2, 0.6), vec3(0.2, 0.8, 1.0), clamp(vHeight * 2.0 + 0.5, 0.0, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
`;

export default function MeshMorph() {
  const uniforms = useMemo(
    () => ({
      progress: { value: 0 },
      radius: { value: 1.2 },
    }),
    [],
  );

  // Keyboard: A -> plane/ripple, D -> dome
  const target = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a") target.current = 0;
      if (e.key.toLowerCase() === "d") target.current = 1;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFrame((_, delta) => {
    const p = uniforms.progress.value;
    const t = target.current;
    const speed = 1.5;
    const step = Math.sign(t - p) * delta * speed;
    const next =
      Math.abs(t - p) < Math.abs(step)
        ? t
        : THREE.MathUtils.clamp(p + step, 0, 1);
    uniforms.progress.value = next;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* Plane in -1..1 range with many segments */}
      <planeGeometry args={[2, 2, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexGLSL}
        fragmentShader={fragmentGLSL}
        uniforms={uniforms}
      />
    </mesh>
  );
}
