precision highp float;

uniform float uGlowIntensity;
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying float vHeight;

void main() {
  vec3 color = uColor * vHeight;
  
  float glow = pow(vHeight, 2.0) * uGlowIntensity;
  color += uColor * glow;
  
  float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
  color *= pulse;
  
  float alpha = smoothstep(0.0, 0.1, vHeight) * 0.9;
  
  gl_FragColor = vec4(color, alpha);
}
