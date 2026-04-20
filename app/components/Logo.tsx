import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function Logo() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Configuration
  const count = Math.pow(2, 18); // 262,144 particles
  const seed = useMemo(() => Math.random() * 0xffffff, []);

  // Attractor positions
  const attractorsPositions = useMemo(
    () => [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, -0.5),
      new THREE.Vector3(0, 0.5, 1),
    ],
    [],
  );

  const attractorsRotationAxes = useMemo(
    () => [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(1, 0, -0.5).normalize(),
    ],
    [],
  );

  // Physics constants
  const config = useMemo(
    () => ({
      attractorMass: 1e7,
      particleGlobalMass: 1e4,
      spinningStrength: 2.75,
      maxSpeed: 8,
      gravityConstant: 6.67e-11,
      velocityDamping: 0.1,
      boundHalfExtent: 8,
      colorA: new THREE.Color("#123524"),
      colorB: new THREE.Color("#39FF14"),
    }),
    [],
  );

  // Hash function (from Three.js TSL)
  const hash = (n: number) => {
    const x = Math.sin(n) * 43758.5453123;
    return x - Math.floor(x);
  };

  // Create particle buffers
  const buffers = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const massMultipliers = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Initialize positions
      const px = (hash(i + seed) - 0.5) * 5;
      const py = (hash(i + seed + 1) - 0.5) * 0.2;
      const pz = (hash(i + seed + 2) - 0.5) * 5;
      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      // Initialize velocities
      const phi = hash(i + seed + 3) * Math.PI * 2;
      const theta = hash(i + seed + 4) * Math.PI;
      const sinPhi = Math.sin(phi);
      velocities[i * 3] = sinPhi * Math.sin(theta) * 0.05;
      velocities[i * 3 + 1] = Math.cos(phi) * 0.05;
      velocities[i * 3 + 2] = sinPhi * Math.cos(theta) * 0.05;

      // Mass multipliers
      massMultipliers[i] = 0.25 + hash(i + seed + 5) * 0.75;

      // Initialize colors
      colors[i * 3] = config.colorA.r;
      colors[i * 3 + 1] = config.colorA.g;
      colors[i * 3 + 2] = config.colorA.b;
    }

    return { positions, velocities, massMultipliers, colors };
  }, [count, seed, config.colorA]);

  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.setAttribute(
      "instancePosition",
      new THREE.InstancedBufferAttribute(buffers.positions, 3),
    );
    geo.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(buffers.colors, 3),
    );
    geo.setAttribute(
      "instanceScale",
      new THREE.InstancedBufferAttribute(buffers.massMultipliers, 1),
    );
    return geo;
  }, [buffers]);

  // Create material
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Custom shader to handle instancing
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
        #include <common>
        attribute vec3 instancePosition;
        attribute vec3 instanceColor;
        attribute float instanceScale;
        varying vec3 vInstanceColor;
        `,
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        vInstanceColor = instanceColor;
        transformed = transformed * instanceScale * 0.008;
        transformed += instancePosition;
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        varying vec3 vInstanceColor;
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `
        #include <color_fragment>
        diffuseColor.rgb = vInstanceColor;
        `,
      );
    };

    return mat;
  }, []);

  // Physics update loop
  useFrame((_state, _delta) => {
    if (!meshRef.current) return;

    const dt = 1 / 60; // Fixed timestep
    const positions = buffers.positions;
    const velocities = buffers.velocities;
    const massMultipliers = buffers.massMultipliers;
    const colors = buffers.colors;

    // Update each particle
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let px = positions[idx];
      let py = positions[idx + 1];
      let pz = positions[idx + 2];
      let vx = velocities[idx];
      let vy = velocities[idx + 1];
      let vz = velocities[idx + 2];

      const particleMass = massMultipliers[i] * config.particleGlobalMass;

      let fx = 0,
        fy = 0,
        fz = 0;

      // Calculate forces from each attractor
      for (let j = 0; j < attractorsPositions.length; j++) {
        const ap = attractorsPositions[j];
        const aa = attractorsRotationAxes[j];

        const dx = ap.x - px;
        const dy = ap.y - py;
        const dz = ap.z - pz;
        const distSq = dx * dx + dy * dy + dz * dz;
        const distance = Math.sqrt(distSq);
        const dirX = dx / distance;
        const dirY = dy / distance;
        const dirZ = dz / distance;

        // Gravity
        const gravityStrength =
          (config.attractorMass * particleMass * config.gravityConstant) /
          distSq;
        fx += dirX * gravityStrength;
        fy += dirY * gravityStrength;
        fz += dirZ * gravityStrength;

        // Spinning force
        const spinForce = gravityStrength * config.spinningStrength;
        const sfx = aa.x * spinForce;
        const sfy = aa.y * spinForce;
        const sfz = aa.z * spinForce;

        // Cross product: spinForce × toAttractor
        const crossX = sfy * dz - sfz * dy;
        const crossY = sfz * dx - sfx * dz;
        const crossZ = sfx * dy - sfy * dx;

        fx += crossX;
        fy += crossY;
        fz += crossZ;
      }

      // Update velocity
      vx += fx * dt;
      vy += fy * dt;
      vz += fz * dt;

      // Limit speed
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed > config.maxSpeed) {
        const scale = config.maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        vz *= scale;
      }

      // Apply damping
      const dampFactor = 1 - config.velocityDamping;
      vx *= dampFactor;
      vy *= dampFactor;
      vz *= dampFactor;

      // Update position
      px += vx * dt;
      py += vy * dt;
      pz += vz * dt;

      // Box wrapping
      const halfHalfExtent = config.boundHalfExtent / 2;
      px = ((px + halfHalfExtent) % config.boundHalfExtent) - halfHalfExtent;
      py = ((py + halfHalfExtent) % config.boundHalfExtent) - halfHalfExtent;
      pz = ((pz + halfHalfExtent) % config.boundHalfExtent) - halfHalfExtent;

      // Write back
      positions[idx] = px;
      positions[idx + 1] = py;
      positions[idx + 2] = pz;
      velocities[idx] = vx;
      velocities[idx + 1] = vy;
      velocities[idx + 2] = vz;

      // Update color based on speed
      const speedNorm = speed / config.maxSpeed;
      const t = Math.min(1, speedNorm);
      // Smoothstep
      const colorMix = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      colors[idx] =
        config.colorA.r + (config.colorB.r - config.colorA.r) * colorMix;
      colors[idx + 1] =
        config.colorA.g + (config.colorB.g - config.colorA.g) * colorMix;
      colors[idx + 2] =
        config.colorA.b + (config.colorB.b - config.colorA.b) * colorMix;
    }

    // Mark attributes for update
    geometry.attributes.instancePosition.needsUpdate = true;
    geometry.attributes.instanceColor.needsUpdate = true;
  });

  return (
    <group scale={[30, 30, 30]}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  );
}
