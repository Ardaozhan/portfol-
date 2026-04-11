/**
 * project.frag.glsl — Fragment shader for project image planes
 *
 * EFFECTS:
 * 1. BASE TEXTURE — standard `texture2D` sample from uTexture
 * 2. RGB SPLIT (Chromatic Aberration) — each colour channel samples
 *    a slightly offset UV, creating prismatic fringing. Strength grows
 *    with mouse velocity (`uVelocity`) and hover state (`uHover`).
 * 3. LIQUID RIPPLE DISTORTION — the UV itself is distorted by a radial
 *    sine wave emanating from the cursor position before sampling.
 * 4. VIGNETTE — darkens edges so the image feels cinematic.
 * 5. SCANLINE — ultra-subtle horizontal banding adds texture/depth.
 */

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float     uTime;
uniform float     uHover;     // [0,1] lerped hover state
uniform vec2      uMouse;     // cursor in UV space [0,1]
uniform float     uVelocity;  // pointer speed, used to scale aberration
uniform vec2      uResolution; // plane dimensions in pixels

void main() {
  vec2 uv = vUv;

  // ── 1. Liquid ripple distortion ──────────────────────────────────────
  vec2  toMouse = uMouse - uv;
  float dist    = length(toMouse);
  float ripple  = sin(dist * 20.0 - uTime * 5.5) * exp(-dist * 5.0);
  uv += normalize(toMouse + 0.001) * ripple * 0.018 * uHover;

  // ── 2. RGB split (chromatic aberration) ─────────────────────────────
  // Split strength scales with velocity so fast mouse moves = more split.
  float aberration = (0.004 + uVelocity * 0.012) * uHover;
  vec2  dir = normalize(toMouse + 0.001);

  float r = texture2D(uTexture, uv + dir * aberration        ).r;
  float g = texture2D(uTexture, uv                           ).g;
  float b = texture2D(uTexture, uv - dir * aberration        ).b;
  float a = texture2D(uTexture, uv).a;

  vec4 color = vec4(r, g, b, a);

  // ── 3. Vignette ──────────────────────────────────────────────────────
  vec2  vigUv   = uv * 2.0 - 1.0;      // remap [0,1] to [-1,1]
  float vignette = 1.0 - dot(vigUv * vec2(0.7, 0.9), vigUv * vec2(0.7, 0.9));
  vignette = clamp(vignette, 0.0, 1.0);
  vignette = pow(vignette, 0.5);       // gentle falloff
  color.rgb *= mix(1.0, vignette, 0.35);

  // ── 4. Scanline (ultra-subtle) ───────────────────────────────────────
  float scan = sin(uv.y * uResolution.y * 1.5) * 0.5 + 0.5;
  color.rgb  *= 1.0 - scan * 0.018;

  // ── 5. Slight saturation boost on hover ─────────────────────────────
  float luma   = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb    = mix(color.rgb, vec3(luma), -0.15 * uHover);

  gl_FragColor = color;
}
