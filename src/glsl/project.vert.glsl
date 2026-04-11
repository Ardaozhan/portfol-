/**
 * project.vert.glsl — Vertex shader for project image planes
 *
 * Passes UV coordinates and world-space position to the fragment shader.
 * Uses a subtle wave deformation driven by uTime + uHover so the plane
 * itself has a gentle organic ripple even before hover.
 */

varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform float uHover;     // [0,1] lerped hover state
uniform vec2  uMouse;     // normalised mouse in [-0.5, 0.5]

void main() {
  vUv = uv;
  vPosition = position;

  // Subtle idle wave — makes the plane feel alive
  vec3 pos = position;
  float wave = sin(pos.x * 3.0 + uTime * 1.2) * 0.008
             + sin(pos.y * 2.5 + uTime * 0.9) * 0.008;

  // On hover: amplify displacement toward mouse position
  vec2 toMouse = uMouse - uv + 0.5;
  float dist   = length(toMouse);
  float ripple = sin(dist * 18.0 - uTime * 5.0) * exp(-dist * 4.0);
  pos.z += ripple * 0.06 * uHover;
  pos.z += wave * (1.0 + uHover * 2.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
