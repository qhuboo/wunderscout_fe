// Uniforms are global variables sent from JS
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform sampler2D uDataTexture; // This is our JSON data texture

// Attributes are specific to this vertex
attribute vec3 position;
attribute vec2 uv;

// Varyings are passed from Vertex -> Fragment Shader
varying float vElevation;
varying vec2 vUv;

void main() {
  vUv = uv;

  // 1. Read the data from the texture at this UV coordinate
  // The density value was stored in the Red (r) channel.
  vec4 dataColor = texture2D(uDataTexture, uv);
  float density = dataColor.r;

  // 2. Pass this density to the fragment shader so we can color it later
  vElevation = density;

  // 3. Displace the position
  vec3 newPos = position;

  // 4. Move Z up based on density
  // Multiplied by 15.0 to control the maximum height of the mountain
  newPos.z += density * 15.0;

  // 5. Calculate final screen position
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1);
}
