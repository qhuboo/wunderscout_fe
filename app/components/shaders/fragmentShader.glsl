#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

varying vec2 vUv;

void main() {
  // Reconstruct fragCoord (pixel coordinates relative to plane)
  vec2 fragCoord = vUv * u_resolution;
  
  // Normalize to 0-1
  vec2 uv = fragCoord / u_resolution;

  vec3 col = 0.5 + 0.5*cos(u_time + uv.xyx + vec3(0, 2, 4));

  gl_FragColor = vec4(col, 1.0);
}
