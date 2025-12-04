precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform mat4 uCameraWorldMatrix; // Passed from React Three Fiber

varying vec2 vUv;

// ================= CONSTANTS =================
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001
#define SPHERE_RADIUS 1.0
#define INITIAL_GLOW_INTENSITY 0.14

const vec3 SPHERE_CENTER = vec3(0.0, 0.0, 0.0);
const vec3 SPHERE_COLOR = vec3(0.0, 0.25, 1.0);

// ================= NOISE FUNCTION =================
// Simplex 3D Noise 
// (Adapted from standard webgl-noise to fix the 'm' variable issue)

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// ================= ROTATION UTILS =================

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

vec3 rotZ(vec3 p, float angle) {
    vec2 res = rotate2d(angle) * p.xy;
    return vec3(res, p.z);
}

vec3 rotX(vec3 p, float angle) {
    vec2 res = rotate2d(angle) * p.yz;
    return vec3(p.x, res);
}

// ================= SDF LOGIC =================

float getSphere(vec3 p, float angle) {
    vec3 localP = p - SPHERE_CENTER;

    // Mimic TypeGPU rotations: Z then X
    vec3 rotatedP = rotZ(localP, -angle * 0.3);
    rotatedP = rotX(rotatedP, -angle * 0.7);

    // Breathing effect
    float radius = SPHERE_RADIUS + sin(angle);

    float rawDist = length(rotatedP) - radius;
    
    // Noise displacement 
    float noise = 0.0;
    if (rawDist < 1.0) {
       noise = snoise(rotatedP + angle);
    }

    return rawDist + noise;
}

// ================= MAIN =================

void main() {
    // 1. Setup UVs
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // 2. Camera Calculation
    // Extract Origin from Camera World Matrix (4th column)
    vec3 ro = vec3(uCameraWorldMatrix[3][0], uCameraWorldMatrix[3][1], uCameraWorldMatrix[3][2]);
    
    // Calculate Direction
    // -2.0 is the focal length. Adjusting this mimics changing FOV.
    vec3 localRay = normalize(vec3(uv, -2.0)); 
    // Rotate the ray direction by the rotation part of the matrix (top-left 3x3)
    vec3 rd = mat3(uCameraWorldMatrix) * localRay;

    // 3. Raymarch
    float distOrigin = 0.0;
    vec3 glow = vec3(0.0);
    vec3 col = vec3(0.0); 
    
    float angle = uTime; 
    bool hit = false;

    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * distOrigin;
        
        float d = getSphere(p, angle);

        // Glow accumulation
        glow += SPHERE_COLOR * exp(-d) * INITIAL_GLOW_INTENSITY;

        distOrigin += d;

        // Far clipping
        if (distOrigin > MAX_DIST) {
            break;
        }
        
        // Hit surface
        if (d < SURF_DIST) {
            col = SPHERE_COLOR; 
            hit = true;
            break;
        }
    }

    // Add glow
    col += glow;

    // 4. Output
    // If we hit nothing, we still show the glow. 
    // We set Alpha to 1.0 if we hit, or if there is significant glow.
    // However, for the AxesHelper to show through the black parts, we can use alpha.
    // If you want the background CSS color to show, use alpha = length(glow).
    // If you want pure black background, use alpha = 1.0.
    
    // Using 0.0 for background alpha allows the CSS background (or objects behind) to show
    float alpha = hit ? 1.0 : clamp(length(glow), 0.0, 1.0);
    
    gl_FragColor = vec4(col, alpha);
}
