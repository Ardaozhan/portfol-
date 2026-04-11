// Vertex shader placeholder
// Used by future WebGL mesh distortion effects (e.g., scroll-driven wave displacement)
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
