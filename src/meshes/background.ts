import * as THREE from "three";
import fragment from "../shaders/grid/fragment.glsl";
import vertex from "../shaders/grid/vertex.glsl";


export function createBackground() {
  const geometry = new THREE.SphereGeometry(20, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    wireframe: false,
  });

  // const material = new THREE.ShaderMaterial({
  //   uniforms: {
  //     uGridSize: { value: 20.0 },
  //   },
  //   vertexShader: vertex,
  //   fragmentShader: fragment,
  //   side: THREE.DoubleSide,
  // });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
