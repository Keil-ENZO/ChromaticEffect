import "./style.css";

import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createBackground } from "./meshes/background";
import { addText } from "./meshes/text";
import {title} from "./meshes/title";
import { createDiamond } from "./meshes/diamond";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const app = document.querySelector<HTMLDivElement>("#app")!;

const renderer = new THREE.WebGLRenderer({
  alpha: true, // fond transparent
  antialias: true, // anti aliasing (bords lisses)
});
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

// const orbits = new OrbitControls(camera, renderer.domElement); // permet de bouger la caméra avec la souris

const background = createBackground();
scene.add(background);

addText("Web Developer", scene);
title("Front end", scene);


const diamond = createDiamond();
scene.add(diamond.mesh);

// stockage pour la photo du fond SANS le diamand au premier plan
const renderTargetSize = 1024;
const renderTarget = new THREE.WebGLRenderTarget(
  renderTargetSize,
  renderTargetSize
);

function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

let mouse = { x: 0, y: 0 };

document.addEventListener("mousemove", function (event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  // Hide the glass object
  diamond.mesh.visible = false;

  // Render the scene to the WebGLRenderTarget
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);

  // Restore the renderer's target and make the glass object visible again
  renderer.setRenderTarget(null);
  diamond.mesh.visible = true;

  diamond.update(renderTarget.texture, camera);
  updateDiamondRotation();
  renderer.render(scene, camera);
}

animate();

// handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(2);
}

window.addEventListener("resize", onWindowResize);

function updateDiamondRotation() {
  const maxRotationDegres = 30;
  let targetRotationX = map(
    mouse.y,
    -1,
    1,
    (-maxRotationDegres * Math.PI) / 180,
    (maxRotationDegres * Math.PI) / 180
  );
  let targetRotationY = map(
    mouse.x,
    -1,
    1,
    (maxRotationDegres * Math.PI) / 180,
    (-maxRotationDegres * Math.PI) / 180
  );

  let lerpFactor = 0.1;
  diamond.mesh.rotation.x +=
    (targetRotationX - diamond.mesh.rotation.x) * lerpFactor;
  diamond.mesh.rotation.y +=
    (targetRotationY - diamond.mesh.rotation.y) * lerpFactor;
}
