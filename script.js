// Quantum Atom Explorer
// This file builds an interactive 3D quantum-mechanical model of the atom using Three.js.
// The goal is to teach visitors that electrons are not tiny planets on fixed tracks.
// Instead, we show probability distributions, orbitals, shells, and quantum information.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const shellDefinitions = [
  { n: 1, label: 'K shell', max: 2, radius: 2.4, color: '#6fe7ff', subshells: ['1s'] },
  { n: 2, label: 'L shell', max: 8, radius: 4.8, color: '#7df9d1', subshells: ['2s', '2p'] },
  { n: 3, label: 'M shell', max: 18, radius: 7.2, color: '#c9b8ff', subshells: ['3s', '3p', '3d'] },
  { n: 4, label: 'N shell', max: 32, radius: 9.6, color: '#ffd166', subshells: ['4s', '4p', '4d', '4f'] }
];

const orbitalDefinitions = [
  { key: '1s', shell: 1, subshell: '1s', type: 's', n: 1, l: 0, ml: 0, ms: '±1/2', label: '1s', capacity: 2, orientation: 'x' },
  { key: '2s', shell: 2, subshell: '2s', type: 's', n: 2, l: 0, ml: 0, ms: '±1/2', label: '2s', capacity: 2, orientation: 'x' },
  { key: '2px', shell: 2, subshell: '2p', type: 'p', n: 2, l: 1, ml: -1, ms: '±1/2', label: '2p(x)', capacity: 2, orientation: 'x' },
  { key: '2py', shell: 2, subshell: '2p', type: 'p', n: 2, l: 1, ml: 0, ms: '±1/2', label: '2p(y)', capacity: 2, orientation: 'y' },
  { key: '2pz', shell: 2, subshell: '2p', type: 'p', n: 2, l: 1, ml: 1, ms: '±1/2', label: '2p(z)', capacity: 2, orientation: 'z' },
  { key: '3s', shell: 3, subshell: '3s', type: 's', n: 3, l: 0, ml: 0, ms: '±1/2', label: '3s', capacity: 2, orientation: 'x' },
  { key: '3px', shell: 3, subshell: '3p', type: 'p', n: 3, l: 1, ml: -1, ms: '±1/2', label: '3p(x)', capacity: 2, orientation: 'x' },
  { key: '3py', shell: 3, subshell: '3p', type: 'p', n: 3, l: 1, ml: 0, ms: '±1/2', label: '3p(y)', capacity: 2, orientation: 'y' },
  { key: '3pz', shell: 3, subshell: '3p', type: 'p', n: 3, l: 1, ml: 1, ms: '±1/2', label: '3p(z)', capacity: 2, orientation: 'z' },
  { key: '3dxy', shell: 3, subshell: '3d', type: 'd', n: 3, l: 2, ml: -2, ms: '±1/2', label: '3d(xy)', capacity: 2, orientation: 'xy' },
  { key: '3dxz', shell: 3, subshell: '3d', type: 'd', n: 3, l: 2, ml: -1, ms: '±1/2', label: '3d(xz)', capacity: 2, orientation: 'xz' },
  { key: '3dz2', shell: 3, subshell: '3d', type: 'd', n: 3, l: 2, ml: 0, ms: '±1/2', label: '3d(z²)', capacity: 2, orientation: 'z2' },
  { key: '3dx2y2', shell: 3, subshell: '3d', type: 'd', n: 3, l: 2, ml: 1, ms: '±1/2', label: '3d(x²−y²)', capacity: 2, orientation: 'x2y2' },
  { key: '3dyz', shell: 3, subshell: '3d', type: 'd', n: 3, l: 2, ml: 2, ms: '±1/2', label: '3d(yz)', capacity: 2, orientation: 'yz' }
];

const elementList = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, isotope: { massNumber: 1, neutrons: 0 }, config: '1s1' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, isotope: { massNumber: 4, neutrons: 2 }, config: '1s2' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, isotope: { massNumber: 7, neutrons: 4 }, config: '1s2 2s1' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, isotope: { massNumber: 12, neutrons: 6 }, config: '1s2 2s2 2p2' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, isotope: { massNumber: 14, neutrons: 7 }, config: '1s2 2s2 2p3' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, isotope: { massNumber: 16, neutrons: 8 }, config: '1s2 2s2 2p4' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, isotope: { massNumber: 20, neutrons: 10 }, config: '1s2 2s2 2p6' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, isotope: { massNumber: 23, neutrons: 12 }, config: '1s2 2s2 2p6 3s1' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, isotope: { massNumber: 24, neutrons: 12 }, config: '1s2 2s2 2p6 3s2' },
  { symbol: 'Al', name: 'Aluminium', atomicNumber: 13, isotope: { massNumber: 27, neutrons: 14 }, config: '1s2 2s2 2p6 3s2 3p1' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, isotope: { massNumber: 28, neutrons: 14 }, config: '1s2 2s2 2p6 3s2 3p2' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, isotope: { massNumber: 31, neutrons: 16 }, config: '1s2 2s2 2p6 3s2 3p3' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, isotope: { massNumber: 32, neutrons: 16 }, config: '1s2 2s2 2p6 3s2 3p4' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, isotope: { massNumber: 35, neutrons: 18 }, config: '1s2 2s2 2p6 3s2 3p5' },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, isotope: { massNumber: 40, neutrons: 22 }, config: '1s2 2s2 2p6 3s2 3p6' },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, isotope: { massNumber: 39, neutrons: 20 }, config: '1s2 2s2 2p6 3s2 3p6 4s1' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, isotope: { massNumber: 40, neutrons: 20 }, config: '1s2 2s2 2p6 3s2 3p6 4s2' },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, isotope: { massNumber: 56, neutrons: 30 }, config: '1s2 2s2 2p6 3s2 3p6 4s2 3d6' },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, isotope: { massNumber: 63, neutrons: 34 }, config: '1s2 2s2 2p6 3s2 3p6 4s1 3d10' }
];

const appState = {
  selectedElement: 'Ne',
  selectedShell: 2,
  selectedOrbital: '2px',
  selectedExplanation: 'electronCloud',
  animationOn: true,
  animationSpeed: 1,
  quality: 'medium',
  labelsVisible: true,
  nucleusVisible: true,
  shellVisible: true,
  cloudVisible: true,
  orbitalVisible: true,
  exhibitionMode: false,
  tourIndex: 0,
  tourActive: false
};

const container = document.getElementById('viewer');
const elementSelect = document.getElementById('element-select');
const elementSummary = document.getElementById('element-summary');
const shellButtonsContainer = document.getElementById('shell-buttons');
const shellDetails = document.getElementById('shell-details');
const subshellTree = document.getElementById('subshell-tree');
const quantumPanel = document.getElementById('quantum-panel');
const electronConfig = document.getElementById('electron-config');
const shellOccupancy = document.getElementById('shell-occupancy');
const sciencePrinciples = document.getElementById('science-principles');
const explainOutput = document.getElementById('explain-output');
const speedControl = document.getElementById('speed-control');
const qualitySelect = document.getElementById('quality-select');
const playToggle = document.getElementById('play-toggle');
const resetCameraButton = document.getElementById('reset-camera');
const explainButton = document.getElementById('explain-button');
const exhibitionToggleButton = document.getElementById('exhibition-toggle');
const tourPanel = document.getElementById('tour-panel');
const tourTitle = document.getElementById('tour-step-title');
const tourText = document.getElementById('tour-step-text');
const tourProgressBar = document.getElementById('tour-progress-bar');
const tourPrev = document.getElementById('tour-prev');
const tourNext = document.getElementById('tour-next');
const tourClose = document.getElementById('tour-close');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030b15);
scene.fog = new THREE.Fog(0x030b15, 18, 48);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
camera.position.set(0, 4.5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 35;
controls.target.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x7ad8ff, 1.8, 80, 2);
pointLight.position.set(8, 10, 15);
scene.add(pointLight);

const fillLight = new THREE.PointLight(0xffd166, 0.9, 60, 2);
fillLight.position.set(-12, -5, -6);
scene.add(fillLight);

const atomRoot = new THREE.Group();
scene.add(atomRoot);

const nucleusGroup = new THREE.Group();
const shellGroup = new THREE.Group();
const electronCloudGroup = new THREE.Group();
const orbitalGroup = new THREE.Group();
const labelGroup = new THREE.Group();

atomRoot.add(nucleusGroup);
atomRoot.add(shellGroup);
atomRoot.add(electronCloudGroup);
atomRoot.add(orbitalGroup);
atomRoot.add(labelGroup);

const performanceConfig = {
  low: { particleCount: 200, opacity: 0.3, shellOpacity: 0.12 },
  medium: { particleCount: 500, opacity: 0.38, shellOpacity: 0.18 },
  high: { particleCount: 1000, opacity: 0.48, shellOpacity: 0.22 }
};

const explainDatabase = {
  electronCloud: 'An electron cloud is a probability map. It does not show a literal glowing trail around the nucleus, but rather the regions where an electron is most likely to be found according to the wavefunction.',
  orbital: 'An orbital is a mathematical description of an electron wavefunction. It represents a region with a high probability of finding an electron, not a fixed path.',
  shell: 'A shell is a grouping of electrons by principal quantum number n. Higher n values place electrons farther from the nucleus and give them higher average energy.',
  subshell: 'Subshells are groups within shells, such as s, p, and d. They help explain the arrangement of electrons and the shape of the orbitals.',
  quantumNumbers: 'Quantum numbers describe the state of an electron: n gives the shell, l the subshell shape, ml the orientation, and ms the spin direction.',
  fixedPaths: 'The Bohr model used fixed circular paths, but modern quantum theory says electrons are described by wavefunctions and probability distributions. There are no precise circular tracks.'
};

const tourSteps = [
  { title: 'Meet the Atom', text: 'Atoms are mostly empty space. The nucleus is tiny compared with the overall size of the atom.', focus: 'nucleus' },
  { title: 'Explore the Nucleus', text: 'Protons and neutrons are packed into the nucleus. The nucleus carries almost all of the atom’s mass.', focus: 'nucleus' },
  { title: 'Discover Electron Clouds', text: 'Electrons are not tiny planets. They form fuzzy probability clouds around the nucleus.', focus: 'electronCloud' },
  { title: 'Explore Shells', text: 'Shells correspond to principal quantum number n. Shell capacity follows the rule 2n².', focus: 2 },
  { title: 'Explore Subshells', text: 'Inside shells are subshells: s, p, d, and f. Each subshell has different shapes and capacities.', focus: '2p' },
  { title: 'Discover Orbitals', text: 'Orbitals are the specific regions where electrons are likely to be found. s orbitals are spherical and p orbitals are two-lobed.', focus: '2px' },
  { title: 'Learn Quantum Numbers', text: 'Quantum numbers describe shell, shape, orientation, and spin. They are key to understanding electron arrangements.', focus: '2pz' },
  { title: 'See Electron Configuration', text: 'The electron configuration reveals how electrons occupy orbitals in an atom, such as 1s² 2s² 2p⁶.', focus: 'config' }
];

function getSelectedElementObject() {
  return elementList.find((el) => el.symbol === appState.selectedElement) || elementList[0];
}

function parseElectronConfiguration(configText) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const tokens = configText.split(/\s+/).filter(Boolean);

  tokens.forEach((token) => {
    const match = token.match(/^(\d+)([spdf])(\d+)$/i);
    if (match) {
      const shell = Number(match[1]);
      const count = Number(match[3]);
      distribution[shell] = (distribution[shell] || 0) + count;
    }
  });

  return distribution;
}

function createLabelSprite(text, color = '#dff7ff') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.4, 1.2, 1);
  return sprite;
}

function randomVectorFromSphere(radius) {
  const phi = Math.random() * Math.PI * 2;
  const costheta = 2 * Math.random() - 1;
  const theta = Math.acos(costheta);
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

function setShellVisibility() {
  shellGroup.visible = appState.shellVisible;
  nucleusGroup.visible = appState.nucleusVisible;
  electronCloudGroup.visible = appState.cloudVisible;
  orbitalGroup.visible = appState.orbitalVisible;
  labelGroup.visible = appState.labelsVisible;
}

function updateToggleButtons() {
  document.querySelectorAll('[data-toggle]').forEach((button) => {
    const key = button.dataset.toggle;
    const visible = key === 'nucleus' ? appState.nucleusVisible :
      key === 'shell' ? appState.shellVisible :
      key === 'electronCloud' ? appState.cloudVisible :
      key === 'orbital' ? appState.orbitalVisible :
      key === 'labels' ? appState.labelsVisible : true;

    button.classList.toggle('active', visible);
  });
}

function buildShells() {
  shellGroup.clear();
  labelGroup.clear();

  shellDefinitions.forEach((shell) => {
    const shellRadius = shell.radius;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(shellRadius, 32, 32),
      new THREE.MeshBasicMaterial({
        color: shell.color,
        transparent: true,
        opacity: performanceConfig[appState.quality].shellOpacity,
        side: THREE.DoubleSide,
        wireframe: true
      })
    );
    shellGroup.add(mesh);

    const label = createLabelSprite(`n = ${shell.n}`);
    label.position.set(0, shellRadius + 0.8, 0);
    labelGroup.add(label);
  });
}

function buildNucleus() {
  nucleusGroup.clear();

  const element = getSelectedElementObject();
  const protonCount = element.atomicNumber;
  const neutronCount = element.isotope.neutrons;

  const protonGeometry = new THREE.SphereGeometry(0.22, 18, 18);
  const neutronGeometry = new THREE.SphereGeometry(0.24, 18, 18);
  const protonMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b, emissive: 0x551111, metalness: 0.3, roughness: 0.35 });
  const neutronMaterial = new THREE.MeshStandardMaterial({ color: 0x7a8cff, emissive: 0x172a55, metalness: 0.35, roughness: 0.4 });

  const protonPositions = [];
  const neutronPositions = [];

  for (let i = 0; i < protonCount; i += 1) {
    const proton = new THREE.Mesh(protonGeometry, protonMaterial);
    const pos = randomVectorFromSphere(0.7);
    proton.position.copy(pos);
    protonPositions.push(pos);
    nucleusGroup.add(proton);
  }

  for (let i = 0; i < neutronCount; i += 1) {
    const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
    const pos = randomVectorFromSphere(0.8);
    neutron.position.copy(pos);
    neutronPositions.push(pos);
    nucleusGroup.add(neutron);
  }

  // Create a central core so the nucleus is visible as a single glowing cluster.
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0x8be6ff,
      emissive: 0x4fa3ff,
      transparent: true,
      opacity: 0.78,
      metalness: 0.12,
      roughness: 0.35
    })
  );
  nucleusGroup.add(core);

  const nucleusLabel = createLabelSprite('Nucleus', '#eaf7ff');
  nucleusLabel.position.set(0, 1.8, 0);
  labelGroup.add(nucleusLabel);

  // Small labels for proton and neutron clues.
  const protonMarker = createLabelSprite('p+', '#ff8a8a');
  protonMarker.position.set(1.8, 2.2, 0.4);
  protonMarker.scale.set(1.4, 0.7, 1);
  labelGroup.add(protonMarker);

  const neutronMarker = createLabelSprite('n', '#8aa5ff');
  neutronMarker.position.set(-2, 1.9, -0.4);
  neutronMarker.scale.set(1.2, 0.7, 1);
  labelGroup.add(neutronMarker);
}

function getShellForOrbital(orbitalKey) {
  const orbital = orbitalDefinitions.find((o) => o.key === orbitalKey);
  return orbital ? orbital.shell : 1;
}

function orbitalMaterial(color, opacity) {
  return new THREE.MeshPhongMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    emissive: color,
    emissiveIntensity: 0.18,
    shininess: 80,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
}

function createPointCloudForOrbital(radius, color, pointCount) {
  const positions = [];
  const colors = [];
  const colorValue = new THREE.Color(color);

  for (let i = 0; i < pointCount; i += 1) {
    const direction = randomVectorFromSphere(radius);
    const r = direction.length();
    if (r <= radius) {
      positions.push(direction.x, direction.y, direction.z);
      colors.push(colorValue.r, colorValue.g, colorValue.b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}

function createOrbitalMesh(orbitalDef) {
  const shellRadius = shellDefinitions.find((s) => s.n === orbitalDef.shell)?.radius || 2.4;
  const group = new THREE.Group();
  const baseColor = orbitalDef.type === 's' ? '#7ff9d1' : orbitalDef.type === 'p' ? '#6fe7ff' : '#bd8cff';
  const alpha = 0.2 + (orbitalDef.shell * 0.06);

  if (orbitalDef.type === 's') {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(shellRadius * 0.52, 30, 30),
      orbitalMaterial(baseColor, alpha)
    );
    group.add(sphere);
    const cloud = createPointCloudForOrbital(shellRadius * 0.52, baseColor, performanceConfig[appState.quality].particleCount / 3);
    group.add(cloud);
  }

  if (orbitalDef.type === 'p') {
    const lobeGeometry = new THREE.SphereGeometry(shellRadius * 0.35, 20, 20);
    const material = orbitalMaterial(baseColor, alpha);
    const lobe1 = new THREE.Mesh(lobeGeometry, material);
    const lobe2 = new THREE.Mesh(lobeGeometry, material);

    if (orbitalDef.orientation === 'x') {
      lobe1.position.x = shellRadius * 0.65;
      lobe2.position.x = -shellRadius * 0.65;
    } else if (orbitalDef.orientation === 'y') {
      lobe1.position.y = shellRadius * 0.65;
      lobe2.position.y = -shellRadius * 0.65;
    } else {
      lobe1.position.z = shellRadius * 0.65;
      lobe2.position.z = -shellRadius * 0.65;
    }

    const connector = new THREE.Mesh(
      new THREE.CylinderGeometry(shellRadius * 0.12, shellRadius * 0.12, shellRadius * 0.8, 18),
      orbitalMaterial(baseColor, alpha * 0.8)
    );
    connector.rotation.x = orbitalDef.orientation === 'x' ? Math.PI / 2 : orbitalDef.orientation === 'y' ? Math.PI / 2 : 0;
    group.add(lobe1, lobe2, connector);

    const cloud = createPointCloudForOrbital(shellRadius * 0.75, baseColor, performanceConfig[appState.quality].particleCount / 3);
    group.add(cloud);
  }

  if (orbitalDef.type === 'd') {
    const lobeGeometry = new THREE.SphereGeometry(shellRadius * 0.22, 18, 18);
    const material = orbitalMaterial(baseColor, alpha);

    const lobes = [];
    const positions = [
      [1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1], [0.8, 0.8, 0], [-0.8, -0.8, 0]
    ];

    positions.forEach(([x, y, z], index) => {
      const lobe = new THREE.Mesh(lobeGeometry, material);
      lobe.position.set(x * shellRadius * 0.92, y * shellRadius * 0.92, z * shellRadius * 0.92);
      lobes.push(lobe);
      group.add(lobe);
    });

    const cloud = createPointCloudForOrbital(shellRadius * 0.82, baseColor, performanceConfig[appState.quality].particleCount / 3);
    group.add(cloud);
  }

  group.userData.orbitalKey = orbitalDef.key;
  group.visible = false;
  return group;
}

function buildAllOrbitals() {
  orbitalGroup.clear();
  orbitalDefinitions.forEach((orbitalDef) => {
    const orbitalMesh = createOrbitalMesh(orbitalDef);
    orbitalMesh.userData.orbitalKey = orbitalDef.key;
    orbitalGroup.add(orbitalMesh);
  });

  updateOrbitalSelection();
}

function updateOrbitalSelection() {
  orbitalGroup.children.forEach((mesh) => {
    const isSelected = mesh.userData.orbitalKey === appState.selectedOrbital;
    const isVisible = appState.orbitalVisible && (isSelected || mesh.userData.orbitalKey.startsWith(appState.selectedShell ? `1` : ''));
    mesh.visible = isSelected && appState.orbitalVisible;

    // add a subtle glow for selected orbitals only
    if (mesh.material && Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => {
        mat.emissiveIntensity = isSelected ? 0.45 : 0.18;
      });
    } else if (mesh.material) {
      mesh.material.emissiveIntensity = isSelected ? 0.45 : 0.18;
    }
  });
}

function renderElementSelector() {
  elementSelect.innerHTML = elementList
    .map((element) => `<option value="${element.symbol}" ${element.symbol === appState.selectedElement ? 'selected' : ''}>${element.name} (${element.symbol})</option>`)
    .join('');
}

function renderShellButtons() {
  shellButtonsContainer.innerHTML = shellDefinitions
    .map((shell) => {
      const active = shell.n === appState.selectedShell ? 'active' : '';
      return `
        <button class="shell-button ${active}" data-shell="${shell.n}">
          <strong>${shell.label}</strong>
          <small>n = ${shell.n}</small>
          <small>Max ${shell.max} e⁻</small>
        </button>
      `;
    })
    .join('');

  shellButtonsContainer.querySelectorAll('.shell-button').forEach((button) => {
    button.addEventListener('click', () => {
      const shellNumber = Number(button.dataset.shell);
      appState.selectedShell = shellNumber;
      appState.selectedExplanation = 'shell';
      renderShellButtons();
      renderShellDetails();
      renderSubshellTree();
      updateExplainOutput();
    });
  });
}

function renderShellDetails() {
  const shell = shellDefinitions.find((entry) => entry.n === appState.selectedShell) || shellDefinitions[0];
  const selectedElement = getSelectedElementObject();
  const distribution = parseElectronConfiguration(selectedElement.config);
  const electronsInShell = distribution[shell.n] || 0;

  shellDetails.innerHTML = `
    <div class="stat-grid">
      <div class="stat-row">
        <span>Shell</span>
        <span class="stat-value">${shell.label}</span>
      </div>
      <div class="stat-row">
        <span>n</span>
        <span class="stat-value">${shell.n}</span>
      </div>
      <div class="stat-row">
        <span>Maximum capacity</span>
        <span class="stat-value">${shell.max} e⁻</span>
      </div>
      <div class="stat-row">
        <span>Formula</span>
        <span class="stat-value">2n²</span>
      </div>
      <div class="stat-row">
        <span>Electrons in this shell</span>
        <span class="stat-value">${electronsInShell}</span>
      </div>
      <div class="stat-row">
        <span>Subshells</span>
        <span class="stat-value">${shell.subshells.join(', ')}</span>
      </div>
    </div>
  `;
}

function renderSubshellTree() {
  const selectedElement = getSelectedElementObject();
  const distribution = parseElectronConfiguration(selectedElement.config);

  subshellTree.innerHTML = shellDefinitions
    .map((shell) => {
      const selectedOrbital = orbitalDefinitions.find((orb) => orb.key === appState.selectedOrbital);
      const thisShell = shell.n === appState.selectedShell ? 'selected' : '';

      return `
        <div class="tree-item ${thisShell}">
          <div class="main-line">
            <strong>Shell ${shell.n}</strong>
            <small>${distribution[shell.n] || 0}/${shell.max} e⁻</small>
          </div>
          ${shell.subshells
            .map((subshell) => {
              const subshellOrbitalEntries = orbitalDefinitions.filter((orb) => orb.shell === shell.n && orb.subshell === subshell);
              const orbButtons = subshellOrbitalEntries
                .map((orb) => {
                  const active = appState.selectedOrbital === orb.key ? 'active' : '';
                  return `<button class="orbital-button ${active}" data-orbital="${orb.key}">${orb.label}</button>`;
                })
                .join('');

              return `
                <div class="main-line">
                  <strong>${subshell}</strong>
                  <small>${subshellOrbitalEntries.length} orbital${subshellOrbitalEntries.length === 1 ? '' : 's'}</small>
                </div>
                <div class="tree-subshells">${orbButtons}</div>
              `;
            })
            .join('')}
        </div>
      `;
    })
    .join('');

  subshellTree.querySelectorAll('.orbital-button').forEach((button) => {
    button.addEventListener('click', () => {
      appState.selectedOrbital = button.dataset.orbital;
      const orbital = orbitalDefinitions.find((item) => item.key === appState.selectedOrbital);
      if (orbital) {
        appState.selectedShell = orbital.shell;
        appState.selectedExplanation = 'orbital';
      }
      renderShellButtons();
      renderShellDetails();
      renderSubshellTree();
      renderQuantumPanel();
      updateExplainOutput();
      updateOrbitalSelection();
    });
  });
}

function renderQuantumPanel() {
  const orbital = orbitalDefinitions.find((entry) => entry.key === appState.selectedOrbital) || orbitalDefinitions[0];
  const lLabels = { 0: 's', 1: 'p', 2: 'd', 3: 'f' };

  const rows = [
    ['n', orbital.n],
    ['l', `${orbital.l} (${lLabels[orbital.l] || '—'})`],
    ['mₗ', orbital.ml],
    ['mₛ', orbital.ms],
    ['Orbital', orbital.label],
    ['Capacity', `${orbital.capacity} e⁻ max`]
  ];

  quantumPanel.innerHTML = `
    <div class="quantum-grid">
      ${rows
        .map(
          ([key, value]) => `
            <div class="quantum-row">
              <span class="key">${key}</span>
              <span class="value">${value}</span>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderElectronConfiguration() {
  const element = getSelectedElementObject();
  const distribution = parseElectronConfiguration(element.config);
  const shellInfo = shellDefinitions.map((shell) => `${shell.n}: ${distribution[shell.n] || 0}`).join(' | ');

  electronConfig.innerHTML = `${element.name} (${element.symbol})<br />${element.config.replace(/\s+/g, ' ')}`;
  shellOccupancy.innerHTML = shellDefinitions
    .map((shell) => `<div class="occupancy-row"><strong>${shell.label}</strong><span>${distribution[shell.n] || 0}/${shell.max}</span></div>`)
    .join('');
}

function renderSciencePrinciples() {
  const principles = [
    'Electrons are described by wavefunctions, not fixed planetary paths.',
    'Orbitals are probability distributions and represent likely electron locations.',
    'Shells correspond to n, while subshells are s, p, d, and f.',
    'Pauli exclusion principle: each orbital holds at most two electrons with opposite spins.',
    'Hund’s rule: electrons fill orbitals singly before pairing in the same subshell.',
    'Aufbau principle: electrons occupy lower-energy orbitals before higher-energy ones.',
    'Heisenberg uncertainty principle: momentum and position cannot both be known exactly.'
  ];

  sciencePrinciples.innerHTML = principles.map((item) => `<li>${item}</li>`).join('');
}

function updateExplainOutput() {
  const orbital = orbitalDefinitions.find((entry) => entry.key === appState.selectedOrbital) || orbitalDefinitions[0];
  const shell = shellDefinitions.find((entry) => entry.n === appState.selectedShell) || shellDefinitions[0];

  let explanation = explainDatabase.fixedPaths;

  if (appState.selectedExplanation === 'electronCloud') explanation = explainDatabase.electronCloud;
  if (appState.selectedExplanation === 'orbital') explanation = explainDatabase.orbital;
  if (appState.selectedExplanation === 'shell') explanation = `${explainDatabase.shell} The selected shell is ${shell.label} (n = ${shell.n}).`;
  if (appState.selectedExplanation === 'subshell') explanation = explainDatabase.subshell;
  if (appState.selectedExplanation === 'quantumNumbers') explanation = `${explainDatabase.quantumNumbers} The selected orbital is ${orbital.label}.`;

  explainOutput.textContent = explanation;
}

function renderElementSummary() {
  const element = getSelectedElementObject();
  const distribution = parseElectronConfiguration(element.config);
  const shellInfo = shellDefinitions
    .map((shell) => `${shell.label}: ${distribution[shell.n] || 0}`)
    .join(' • ');

  elementSummary.innerHTML = `
    <div class="stat-grid">
      <div class="stat-row"><span>Atomic number</span><span class="stat-value">${element.atomicNumber}</span></div>
      <div class="stat-row"><span>Protons</span><span class="stat-value">${element.atomicNumber}</span></div>
      <div class="stat-row"><span>Neutrons</span><span class="stat-value">${element.isotope.neutrons}</span></div>
      <div class="stat-row"><span>Electrons</span><span class="stat-value">${element.atomicNumber}</span></div>
      <div class="stat-row"><span>Assumption</span><span class="stat-value">${element.symbol}-${element.isotope.massNumber}</span></div>
      <div class="stat-row"><span>Distribution</span><span class="stat-value">${shellInfo}</span></div>
    </div>
  `;
}

function updateVisibleOrbitals() {
  orbitalGroup.children.forEach((mesh) => {
    const orbitalKey = mesh.userData.orbitalKey;
    const shouldShow = orbitalKey === appState.selectedOrbital;
    mesh.visible = shouldShow && appState.orbitalVisible;
  });
}

function applyQualitySettings() {
  shellGroup.children.forEach((mesh) => {
    if (mesh.material && mesh.material.transparent) {
      mesh.material.opacity = performanceConfig[appState.quality].shellOpacity;
    }
  });

  orbitalGroup.children.forEach((mesh) => {
    if (mesh.material && mesh.material.opacity !== undefined) {
      mesh.material.opacity = performanceConfig[appState.quality].opacity;
    }
  });
}

function initializeControls() {
  elementSelect.addEventListener('change', (event) => {
    appState.selectedElement = event.target.value;
    const element = getSelectedElementObject();
    const config = element.config.split(' ');
    appState.selectedOrbital = config[config.length - 1].replace(/\d+/g, '').length ? `${config[config.length - 1].replace(/\d+/g, '')}` : '1s';
    appState.selectedShell = Number(config[0].match(/\d+/)?.[0] || 1);
    appState.selectedExplanation = 'electronCloud';
    rebuildAtom();
  });

  document.querySelectorAll('[data-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.toggle;
      if (key === 'nucleus') appState.nucleusVisible = !appState.nucleusVisible;
      if (key === 'shell') appState.shellVisible = !appState.shellVisible;
      if (key === 'electronCloud') appState.cloudVisible = !appState.cloudVisible;
      if (key === 'orbital') appState.orbitalVisible = !appState.orbitalVisible;
      if (key === 'labels') appState.labelsVisible = !appState.labelsVisible;

      setShellVisibility();
      updateToggleButtons();
    });
  });

  speedControl.addEventListener('input', (event) => {
    appState.animationSpeed = Number(event.target.value);
  });

  qualitySelect.addEventListener('change', (event) => {
    appState.quality = event.target.value;
    rebuildAtom();
  });

  playToggle.addEventListener('click', () => {
    appState.animationOn = !appState.animationOn;
    playToggle.textContent = appState.animationOn ? 'Pause' : 'Play';
  });

  resetCameraButton.addEventListener('click', () => {
    camera.position.set(0, 4.5, 15);
    controls.target.set(0, 0, 0);
    controls.update();
  });

  explainButton.addEventListener('click', () => {
    const selectedOrbital = orbitalDefinitions.find((item) => item.key === appState.selectedOrbital);
    if (selectedOrbital) {
      appState.selectedExplanation = 'orbital';
    } else {
      appState.selectedExplanation = 'electronCloud';
    }
    updateExplainOutput();
  });

  exhibitionToggleButton.addEventListener('click', () => {
    appState.exhibitionMode = !appState.exhibitionMode;
    document.body.classList.toggle('exhibition-mode', appState.exhibitionMode);
    exhibitionToggleButton.textContent = appState.exhibitionMode ? 'Exit Exhibition' : 'Exhibition Mode';
    if (appState.exhibitionMode) {
      startInteractiveTour();
    } else {
      stopInteractiveTour();
    }
  });

  tourNext.addEventListener('click', () => {
    advanceTour(1);
  });

  tourPrev.addEventListener('click', () => {
    advanceTour(-1);
  });

  tourClose.addEventListener('click', () => {
    stopInteractiveTour();
    appState.exhibitionMode = false;
    document.body.classList.remove('exhibition-mode');
    exhibitionToggleButton.textContent = 'Exhibition Mode';
  });
}

function rebuildAtom() {
  buildShells();
  buildNucleus();
  buildAllOrbitals();
  renderElementSummary();
  renderShellButtons();
  renderShellDetails();
  renderSubshellTree();
  renderQuantumPanel();
  renderElectronConfiguration();
  setShellVisibility();
  updateToggleButtons();
  updateExplainOutput();
}

function startInteractiveTour() {
  appState.tourActive = true;
  appState.tourIndex = 0;
  tourPanel.classList.remove('hidden');
  updateTourDisplay();

  clearInterval(window.tourTimer);
  window.tourTimer = setInterval(() => {
    if (appState.tourActive) {
      advanceTour(1);
    }
  }, 5000);
}

function stopInteractiveTour() {
  appState.tourActive = false;
  tourPanel.classList.add('hidden');
  clearInterval(window.tourTimer);
}

function advanceTour(step) {
  if (!appState.tourActive) return;
  appState.tourIndex += step;
  if (appState.tourIndex >= tourSteps.length) appState.tourIndex = 0;
  if (appState.tourIndex < 0) appState.tourIndex = tourSteps.length - 1;
  updateTourDisplay();
}

function updateTourDisplay() {
  const step = tourSteps[appState.tourIndex];
  tourTitle.textContent = step.title;
  tourText.textContent = step.text;
  const progress = ((appState.tourIndex + 1) / tourSteps.length) * 100;
  tourProgressBar.style.width = `${progress}%`;

  if (typeof step.focus === 'number') {
    appState.selectedShell = step.focus;
  } else if (step.focus === 'nucleus') {
    appState.selectedExplanation = 'electronCloud';
    appState.selectedOrbital = '1s';
  } else if (step.focus === 'electronCloud') {
    appState.selectedExplanation = 'electronCloud';
    appState.selectedOrbital = '2px';
  } else if (step.focus === '2p') {
    appState.selectedExplanation = 'subshell';
    appState.selectedOrbital = '2px';
    appState.selectedShell = 2;
  } else if (step.focus === 'config') {
    appState.selectedExplanation = 'orbital';
    appState.selectedOrbital = '3dxy';
    appState.selectedShell = 3;
  } else {
    const orbital = orbitalDefinitions.find((item) => item.key === step.focus);
    if (orbital) {
      appState.selectedOrbital = orbital.key;
      appState.selectedShell = orbital.shell;
      appState.selectedExplanation = 'orbital';
    }
  }

  renderShellButtons();
  renderShellDetails();
  renderSubshellTree();
  renderQuantumPanel();
  updateExplainOutput();
  updateOrbitalSelection();
}

function updateCameraForResize() {
  const { clientWidth, clientHeight } = container;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (appState.animationOn) {
    atomRoot.rotation.y += 0.0035 * appState.animationSpeed;
    atomRoot.rotation.x = Math.sin(performance.now() * 0.0003) * 0.3;
  }

  controls.update();
  renderer.render(scene, camera);
}

function initialize() {
  renderElementSelector();
  renderSciencePrinciples();
  rebuildAtom();
  initializeControls();
  renderShellButtons();
  renderSubshellTree();
  renderQuantumPanel();
  setShellVisibility();
  updateToggleButtons();
  updateExplainOutput();
  applyQualitySettings();
  updateCameraForResize();
  animate();
}

window.addEventListener('resize', updateCameraForResize);

initialize();
