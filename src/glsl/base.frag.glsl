// Fragment shader placeholder
// Will be replaced with noise-based distortion or post-processing effects
varying vec2 vUv;
uniform float uTime;
uniform float uScrollProgress;

void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
