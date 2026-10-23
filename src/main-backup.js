
import './style.css'
import * as THREE from 'three'

document.querySelector('#app').innerHTML = `
  <main class="world">
    <div class="cloud cloud-one">☁</div>
    <div class="cloud cloud-two">☁</div>
    <div class="sparkle sparkle-one">✦</div>
    <div class="sparkle sparkle-two">✧</div>
    <div class="sparkle sparkle-three">♡</div>

    <header class="topbar">
      <a class="brand" href="#">☁ Cinna's Cloud Café</a>
      <span class="status"><span></span> LITTLE DREAM WORLD</span>
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
    </section>

    <footer>
      <span>MADE WITH ♡ AND A LITTLE CLOUD MAGIC</span>
      <span>TAKE A DEEP BREATH & DREAM ☁</span>
    </footer>
  </main>
`

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

// A cute stylized puppy-like cloud plush, built from 3D shapes.
ball(plush, white, [0, 0.1, 0], [0.88, 0.9, 0.64])

// Long floppy ears.
const leftEar = ball(plush, white, [-0.82, 0.42, -0.02], [0.34, 0.76, 0.28])
leftEar.rotation.z = 0.48

const rightEar = ball(plush, white, [0.82, 0.42, -0.02], [0.34, 0.76, 0.28])
rightEar.rotation.z = -0.48

// Soft blue ear accents.
const leftInner = ball(plush, blue, [-0.86, 0.4, 0.22], [0.19, 0.52, 0.07])
leftInner.rotation.z = 0.48
const rightInner = ball(plush, blue, [0.86, 0.4, 0.22], [0.19, 0.52, 0.07])
rightInner.rotation.z = -0.48

// Tiny arms and feet.
ball(plush, white, [-0.68, -0.28, 0.12], [0.22, 0.17, 0.22]).rotation.z = -0.4
ball(plush, white, [0.68, -0.28, 0.12], [0.22, 0.17, 0.22]).rotation.z = 0.4
ball(plush, white, [-0.4, -0.72, 0.13], [0.3, 0.18, 0.27])
ball(plush, white, [0.4, -0.72, 0.13], [0.3, 0.18, 0.27])

// Eyes, cheeks and a tiny mouth.
ball(plush, dark, [-0.28, 0.12, 0.58], [0.055, 0.075, 0.035], 20)
ball(plush, dark, [0.28, 0.12, 0.58], [0.055, 0.075, 0.035], 20)
ball(plush, pink, [-0.43, -0.1, 0.54], [0.12, 0.065, 0.025], 20)
ball(plush, pink, [0.43, -0.1, 0.54], [0.12, 0.065, 0.025], 20)
ball(plush, pink, [0, -0.05, 0.62], [0.055, 0.035, 0.025], 20)

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
  plush.position.y = Math.sin(Date.now() * 0.0015) * 0.07
  renderer.render(scene, camera)
}
resize()
animate()
