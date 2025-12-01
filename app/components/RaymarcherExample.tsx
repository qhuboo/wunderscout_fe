import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";

const vertexGLSL = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0); // screen-aligned quad
}
`;

const fragmentGLSL = `
precision highp float;

varying vec2 vUv;
uniform float progress;   // 0..1
uniform vec2 resolution;  // viewport size
uniform vec3 camPos;      // camera position
uniform mat4 viewMatrixInv;
uniform mat4 projMatrixInv;

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Reconstruct a world-space ray from screen uv
vec3 getRayDir(vec2 uv) {
  // NDC coordinates (-1..1)
  vec4 ndc = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  vec4 view = projMatrixInv * ndc;
  view /= view.w;
  vec4 world = viewMatrixInv * view;
  vec3 dir = normalize(world.xyz - camPos);
  return dir;
}

void main() {
  vec2 uv = vUv;
  vec3 ro = camPos;
  vec3 rd = getRayDir(uv);

  // Sphere radius controlled by progress
  float radius = mix(0.2, 1.0, progress);

  float t = 0.0;
  float d;
  vec3 col = vec3(0.0);
  bool hit = false;

  // Simple raymarch loop
  for (int i = 0; i < 96; i++) {
    vec3 p = ro + rd * t;
    d = sdSphere(p, radius);
    if (d < 0.001) { hit = true; break; }
    if (t > 10.0) break;
    t += d;
  }

  if (hit) {
    // simple normal estimate
    vec3 p = ro + rd * t;
    float e = 0.001;
    vec3 n = normalize(vec3(
      sdSphere(p + vec3(e,0,0), radius) - sdSphere(p - vec3(e,0,0), radius),
      sdSphere(p + vec3(0,e,0), radius) - sdSphere(p - vec3(0,e,0), radius),
      sdSphere(p + vec3(0,0,e), radius) - sdSphere(p - vec3(0,0,e), radius)
    ));
    // simple lighting
    vec3 ldir = normalize(vec3(0.6, 0.8, 0.2));
    float diff = max(dot(n, ldir), 0.0);
    col = vec3(0.2, 0.7, 1.0) * (0.2 + 0.8 * diff);
  } else {
    // background
    col = vec3(0.05, 0.07, 0.1);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function RaymarchQuad() {
  const uniforms = useMemo(
    () => ({
      progress: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
      camPos: { value: new THREE.Vector3() },
      viewMatrixInv: { value: new THREE.Matrix4() },
      projMatrixInv: { value: new THREE.Matrix4() },
    }),
    [],
  );

  // Keyboard: A -> small sphere, D -> big sphere
  const target = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a") target.current = 0;
      if (e.key.toLowerCase() === "d") target.current = 1;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFrame((state, delta) => {
    const { size, camera } = state;
    uniforms.resolution.value.set(size.width, size.height);
    uniforms.camPos.value.copy(camera.position);
    uniforms.viewMatrixInv.value.copy(camera.matrixWorld); // inverse of view
    uniforms.projMatrixInv.value.copy(camera.projectionMatrix).invert();

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
    <mesh renderOrder={1}>
      {/* Fullscreen quad: plane in clip space [-1,1] */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexGLSL}
        fragmentShader={fragmentGLSL}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
