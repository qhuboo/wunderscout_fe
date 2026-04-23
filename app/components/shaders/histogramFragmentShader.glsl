precision highp float;

varying vec2 vUv;
varying float vIntensity;

void main() {
    vec3 colorLow = vec3(0.1, 0.1, 0.5);
    vec3 colorHigh = vec3(1.0, 0.2, 0.0);
    
    vec3 finalColor = mix(colorLow, colorHigh, vIntensity);

    float alpha = vIntensity > 0.001 ? 0.9 : 0.2;

    gl_FragColor = vec4(finalColor, alpha);
}
