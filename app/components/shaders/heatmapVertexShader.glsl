uniform sampler2D uDensityMap;
uniform float uHeightScale;

varying vec2 vUv;
varying float vHeight;

void main() {
  vUv = uv;
  
  float density = texture2D(uDensityMap, uv).r;
  vHeight = density;
  
  vec3 displaced = position;
  displaced.z = density * uHeightScale;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
