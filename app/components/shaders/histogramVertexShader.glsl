precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;

uniform sampler2D uDataTexture;
uniform vec2 uBins;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vIntensity;

void main() {
    vUv = uv;

    vec2 binCenterUv = (floor(uv * uBins) + 0.5) / uBins;

    vec4 data = texture2D(uDataTexture, binCenterUv);
    
    vIntensity = data.r;

    float heightScale = 10.0;
    vec3 transformed = position;
    transformed.z += vIntensity * heightScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
