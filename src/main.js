
import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';


document.querySelector('#app').innerHTML = `
  <main class="world">
    <div class="cloud cloud-one">☁</div>
    <div class="cloud cloud-two">☁</div>
    
<div class="smile-cloud smile-cloud-one">
  <span class="cloud-cheeks"><span>●</span><span>●</span></span>
  <span class="cloud-face">⌒‿⌒</span>
</div>
<div class="smile-cloud smile-cloud-two">
  <span class="cloud-cheeks"><span>●</span><span>●</span></span>
  <span class="cloud-face">⌒‿⌒</span>
</div>
<div class="smile-cloud smile-cloud-three">
  <span class="cloud-cheeks"><span>●</span><span>●</span></span>
  <span class="cloud-face">⌒‿⌒</span>
</div>

    <div class="sparkle sparkle-one">✦</div>
    <div class="sparkle sparkle-two">✧</div>
    <div class="sparkle sparkle-three">♡</div>
    
<div class="night-stars" aria-hidden="true">
  <span>✦</span>
  <span>✧</span>
  <span>⋆</span>
  <span>✦</span>
  <span>✧</span>
  <span>⋆</span>
  <span>✦</span>
  <span>✧</span>
  <span>⋆</span>
  <span>✦</span>
  <span>✧</span>
  <span>⋆</span>
</div>

    
<div class="extra-float float-heart-one">♡</div>
<div class="extra-float float-heart-two">♡</div>
<div class="extra-float float-star-one">✦</div>
<div class="extra-float float-star-two">✧</div>

<div class="smile-cloud smile-cloud-four">
  <span class="cloud-cheeks">●　●</span>
  <span class="cloud-face">⌒‿⌒</span>
</div>
<div class="smile-cloud smile-cloud-five">
  <span class="cloud-cheeks">●　●</span>
  <span class="cloud-face">⌒‿⌒</span>
</div>


    <header class="topbar">
      <a class="brand" href="#">☁ Cinna's Cloud Café</a>
      
<div class="header-actions">
  <span class="status"><span></span> LITTLE DREAM WORLD</span>
  <button id="theme-toggle" type="button" aria-label="Switch to night mode">
    🌙 Night
  </button>
</div>

    </header>

    <section class="intro">
      <p class="eyebrow">A LITTLE CLOUD OF HAPPINESS</p>
      <h1>Meet your new<br><span>cloud companion.</span></h1>
      <p class="subtitle">A tiny friend, a dreamy sky, and a little bit of magic.</p>
    </section>

    <section class="viewer">
      <div class="viewer-label">YOUR LITTLE COMPANION <span>♡</span></div>
      <div class="stage">
        <div class="halo"></div>
        <div class="platform"></div>
        <div id="canvas-holder"></div>
        <div class="hint">✧ DRAG TO ROTATE ✧</div>
      </div>
      <div class="controls">
        <button id="rotate-left" aria-label="Rotate left">↶</button>
        <button id="reset">↻ &nbsp; Reset view</button>
        <button id="rotate-right" aria-label="Rotate right">↷</button>
      </div>
      
      <div class="hand-panel">
        <p class="hand-title">✋ HAND MAGIC</p>
        <button id="hand-toggle" type="button">✋ Start Hand Tracking</button>
        <p id="hand-status" role="status">Press start to enable your camera</p>
        <p id="gesture-status" role="status">Gesture: waiting for your hand ✋</p>
        <video id="hand-video" autoplay playsinline muted></video>
      </div>

    </section>

    <footer>
      <span>MADE WITH ♡ AND A LITTLE CLOUD MAGIC</span>
      <span>TAKE A DEEP BREATH & DREAM ☁</span>
    </footer>
  </main>
`;

const themeToggle = document.querySelector('#theme-toggle');

themeToggle.addEventListener('click', () => {
  const isNight = document.body.classList.toggle('night-mode');

  themeToggle.textContent = isNight ? '☀️ Day' : '🌙 Night';
  themeToggle.setAttribute(
    'aria-label',
    isNight ? 'Switch to day mode' : 'Switch to night mode'
  );
});


const holder = document.querySelector('#canvas-holder')
const scene = new THREE.Scene()
scene.background = null

const camera = new THREE.PerspectiveCamera(
  35,
  holder.clientWidth / holder.clientHeight,
  0.1,
  100
)
camera.position.set(0, 0, 8)

const MIN_ZOOM = 2.5;
const MAX_ZOOM = 8;
const ZOOM_SMOOTHING = 0.08;
let targetZoom = 8;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(holder.clientWidth, holder.clientHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setClearColor(0x000000, 0)
holder.appendChild(renderer.domElement)

scene.add(new THREE.HemisphereLight(0xffffff, 0xc4dafa, 2))

const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(3, 5, 6)
scene.add(light)

const plush = new THREE.Group()
scene.add(plush)

const loader = new GLTFLoader()

loader.load(import.meta.env.BASE_URL + 'models/cinnamorroll.glb', (gltf) => {
  const model = gltf.scene

  // Find the model's size
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  // Center the model
  model.position.sub(center)

  // Make it fit the viewer
  const maxDimension = Math.max(size.x, size.y, size.z)
  if (maxDimension > 0) {
    const scale = 7.5 / maxDimension
    model.scale.setScalar(scale)
  }

  plush.add(model)
})

const white = new THREE.MeshStandardMaterial({
  color: 0xfffdfd,
  roughness: 0.92
})
const blue = new THREE.MeshStandardMaterial({
  color: 0x91c9f8,
  roughness: 0.8
})
const pink = new THREE.MeshStandardMaterial({
  color: 0xffaeca,
  roughness: 0.8
})
const dark = new THREE.MeshStandardMaterial({
  color: 0x594e79,
  roughness: 0.6
})

function ball(parent, material, position, scale, segments = 32) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, segments, segments),
    material
  )
  mesh.position.set(...position)
  mesh.scale.set(...scale)
  parent.add(mesh)
  return mesh
}

let targetRotation = 0
let dragging = false
let lastX = 0

renderer.domElement.style.cursor = 'grab'
renderer.domElement.addEventListener('pointerdown', (event) => {
  dragging = true
  lastX = event.clientX
  renderer.domElement.setPointerCapture(event.pointerId)
  renderer.domElement.style.cursor = 'grabbing'
})

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return
  targetRotation += (event.clientX - lastX) * 0.012
  lastX = event.clientX
})

function stopDragging() {
  dragging = false
  renderer.domElement.style.cursor = 'grab'
}
renderer.domElement.addEventListener('pointerup', stopDragging)
renderer.domElement.addEventListener('pointercancel', stopDragging)

document.querySelector('#rotate-left').addEventListener('click', () => {
  targetRotation -= 0.55
})
document.querySelector('#rotate-right').addEventListener('click', () => {
  targetRotation += 0.55
})
document.querySelector('#reset').addEventListener('click', () => {
  targetRotation = 0
})

function resize() {
  const width = holder.clientWidth
  const height = holder.clientHeight
  if (!width || !height) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}
window.addEventListener('resize', resize)

function animate() {
  requestAnimationFrame(animate)
  plush.rotation.y += (targetRotation - plush.rotation.y) * 0.09
  camera.position.z +=
  (targetZoom - camera.position.z) * ZOOM_SMOOTHING;
  plush.position.y = Math.sin(Date.now() * 0.0015) * 0.07
  renderer.render(scene, camera)
}
resize()
animate()

const handButton = document.querySelector('#hand-toggle');
const handStatus = document.querySelector('#hand-status');
const handVideo = document.querySelector('#hand-video');

let handLandmarker = null;
let handCameraStream = null;
let handTrackingActive = false;
let previousHandX = null;
let lastVideoTime = -1;
let smoothedHandSize = null;
const gestureStatus = document.querySelector('#gesture-status');
let currentGesture = 'none';
let gestureFrames = 0;

handButton.addEventListener('click', async () => {
  if (handTrackingActive) {
    handTrackingActive = false;

    if (handCameraStream) {
      handCameraStream.getTracks().forEach(track => track.stop());
      handCameraStream = null;
    }

    handVideo.srcObject = null;
    handVideo.style.display = 'none';
    handButton.textContent = '✋ Start Hand Tracking';
    handStatus.textContent = 'Hand tracking stopped';
    previousHandX = null;
    return;
  }

  handButton.disabled = true;
  handStatus.textContent = 'Loading hand tracking...';

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera access requires localhost or HTTPS.');
    }

    if (!handLandmarker) {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1
      });
    }

    handCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });

    handVideo.srcObject = handCameraStream;
    handVideo.style.display = 'block';
    await handVideo.play();

    handTrackingActive = true;
    handButton.textContent = '✋ Stop Hand Tracking';
    handStatus.textContent = 'Show one hand to the camera!';
    trackHandMovement();
  } catch (error) {
    handTrackingActive = false;

    if (handCameraStream) {
      handCameraStream.getTracks().forEach(track => track.stop());
      handCameraStream = null;
    }

    handVideo.srcObject = null;
    handVideo.style.display = 'none';
    handButton.textContent = '✋ Start Hand Tracking';
    handStatus.textContent = `Could not start: ${error.message}`;
    console.error('Hand tracking error:', error);
  } finally {
    handButton.disabled = false;
  }
});

function trackHandMovement() {
  if (!handTrackingActive) return;

  if (
    handVideo.readyState >= 2 &&
    handVideo.currentTime !== lastVideoTime
  ) {
    lastVideoTime = handVideo.currentTime;

    const results = handLandmarker.detectForVideo(
      handVideo,
      performance.now()
    );

    if (results.landmarks.length > 0) {
      const wristX = results.landmarks[0][0].x;
      const hand = results.landmarks[0];

const wrist = hand[0];
const middleFingerTip = hand[12];

const handSize = Math.hypot(
  middleFingerTip.x - wrist.x,
  middleFingerTip.y - wrist.y
);
if (smoothedHandSize === null) {
  smoothedHandSize = handSize;
} else {
  smoothedHandSize += (handSize - smoothedHandSize) * 0.2;
}
const normalizedHandSize = Math.max(
  0,
  Math.min(1, (smoothedHandSize - 0.12) / (0.45 - 0.12))
);

targetZoom = MAX_ZOOM - normalizedHandSize * (MAX_ZOOM - MIN_ZOOM);
      if (previousHandX !== null) {
        const movement = wristX - previousHandX;
        targetRotation -= movement * 4;
      }

      previousHandX = wristX;
      handStatus.textContent = 'Hand detected! Move left or right 💙';
    } else {
      previousHandX = null;
      handStatus.textContent = 'Show one hand to the camera!';
    }
  }

  requestAnimationFrame(trackHandMovement);
}
