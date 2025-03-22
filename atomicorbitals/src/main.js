import "./style.css";

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { div } from "three/tsl";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);


const elements = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, position: [0, 0] },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, position: [17, 0] },
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, position: [0, 0], orbitals: ['s'] },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, position: [17, 0], orbitals: ['s'] },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, position: [16, 1], orbitals: ['s', 'p'] },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, position: [8, 3], orbitals: ['s', 'p', 'd'] },
  { symbol: 'U', name: 'Uranium', atomicNumber: 92, position: [2, 6], orbitals: ['s', 'p', 'd', 'f'] },
  // Add more elements with correct positions
];

function createPeriodicTable() {
  const container = document.createElement('div');
  const titleBar = document.createElement('div');
  titleBar.innerHTML = `
    <div class="title-bar">
  <div class="title-bar-text">Periodická soustava prvků</div>
  <div class="title-bar-controls">
    <button aria-label="Close" style="float:left;"></button>
  </div>
</div>
`;
container.appendChild(titleBar);
const table = document.createElement('div');
  

elements.forEach(el => {
  const button = document.createElement('button');
  button.innerText = el.symbol;
  button.style.padding = '10px';
  button.title = `${el.name}\nAtomic No: ${el.atomicNumber}`;
  button.onclick = () => renderOrbital(el);
  table.appendChild(button);
});

container.appendChild(table);
document.body.appendChild(container);
}

function createOrbitalShape(type, radius, color) {
  let geometry;
  switch (type) {
    case 's':
      geometry = new THREE.SphereGeometry(radius, 32, 32);
      break;
    case 'p':
      geometry = new THREE.TorusGeometry(radius, 0.1, 16, 100);
      break;
    case 'd':
      geometry = new THREE.OctahedronGeometry(radius);
      break;
    case 'f':
      geometry = new THREE.TorusKnotGeometry(radius, 0.2, 100, 16);
      break;
    default:
      return null;
  }

  const material = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.5, wireframe: true });
  return new THREE.Mesh(geometry, material);
}

function renderOrbital(element) {
  if (!element) return;
  scene.clear();
  
  const ambientLight = new THREE.AmbientLight(0x404040, 2); // Increased intensity for better visibility
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  scene.add(pointLight);
  pointLight.position.set(0, 0, 2);


  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);
  
  const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
  const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
  scene.add(nucleus);
  
  // Add orbitals dynamically based on the element
  const colors = { s: 'blue', p: 'green', d: 'yellow', f: 'purple' };
  element.orbitals.forEach((type, index) => {
    const orbital = createOrbitalShape(type, 1 + index * 0.5, colors[type]);
    if (orbital) scene.add(orbital);
  });
}

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
createPeriodicTable();