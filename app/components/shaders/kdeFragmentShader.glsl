precision mediump float;

varying float vElevation; // Received from the vertex shader
varying vec2 vUv;

void main() {
  // Color Palette
  vec3 lowColor =  vec3(0.0, 0.2, 0.8); // Deep Blue (Low density)
  vec3 highColor =  vec3(1.0, 0.1, 0.1); // Bright Red (High density)

  // Mix the colors based on elevation
  // smoothstep helps make the trasition smoother/contrastier
  float mixStrength = smoothstep(0.0, 1.0, vElevation);

  vec3 color = mix(lowColor, highColor, mixStrength);

  // Output the color (R, G, B, Alpha)
  gl_FragColor = vec4(color, 0.9);
}
