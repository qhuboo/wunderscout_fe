precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSphereAngle;
uniform float uGlowIntensity;
uniform vec2 uResolution;
uniform vec3 uSphereColor;
uniform vec3 uCameraPosition;
uniform mat4 uCameraMatrix;

#define MAX_STEPS 100
#define MAX_DIST 19.0
#define SURF_DIST 0.001
#define SPHERE_RADIUS 3.0

const vec3 sphereCenter = vec3(0.0, 0.0, 0.0);
const vec4 skyColor1 = vec4(0.1, 0.0, 0.2, 1.0);
const vec4 skyColor2 = vec4(0.28, 0.0, 0.54, 1.0);

// Perlin noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float perlin3d(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// Rotation matrices
mat3 rotateAroundZ(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
}

mat3 rotateAroundX(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

struct Ray {
  float dist;
  vec3 color;
};

Ray getSphere(vec3 p, vec3 sphereCol, vec3 center, float angle) {
  vec3 localP = p - center;
  mat3 rotMatZ = rotateAroundZ(-angle * 0.3);
  mat3 rotMatX = rotateAroundX(-angle * 0.7);
  vec3 rotatedP = rotMatX * rotMatZ * localP;

  float radius = SPHERE_RADIUS + sin(angle);
  float rawDist = sdSphere(rotatedP, radius);

  float noise = 0.0;
  if (rawDist < 1.0) {
    noise += perlin3d(rotatedP + angle);
  }

  return Ray(rawDist + noise, sphereCol);
}

struct LightRay {
  Ray ray;
  vec3 glow;
};

LightRay rayMarch(vec3 ro, vec3 rd) {
  float distOrigin = 0.0;
  Ray result = Ray(MAX_DIST, vec3(0.0));
  vec3 glow = vec3(0.0);

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * distOrigin;
    Ray sphere = getSphere(p, uSphereColor, sphereCenter, uSphereAngle);

    glow += uSphereColor * exp(-sphere.dist);
    distOrigin += sphere.dist;

    if (distOrigin > MAX_DIST) {
      result.dist = MAX_DIST;
      break;
    }

    if (sphere.dist < SURF_DIST) {
      result.dist = distOrigin;
      result.color = sphere.color;
      break;
    }
  }

  return LightRay(result, glow);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  vec3 ro = vec3(uCameraPosition);
  vec3 rd = normalize(vec3(uv.x, uv.y, -1.0));
  rd = (uCameraMatrix * vec4(rd, 0.0)).xyz;

  LightRay march = rayMarch(ro, rd);

  // Sphere surface color with distance fade
  float fog = min(march.ray.dist / MAX_DIST, 1.0);
  vec3 color = mix(march.ray.color, vec3(0.0), fog);

  // Glow contributes to both color and alpha
  vec3 finalColor = mix(color, march.glow, uGlowIntensity);
  float alpha = length(march.glow) * uGlowIntensity + (1.0 - fog) * 0.5;

  gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
}
