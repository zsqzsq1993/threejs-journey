import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

/**
 * Globals
 */
// global gui tweaks
const debugObject = {
  color: '#6c45a5',
  subdivision: 2
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(
  1, 1, 1,
  debugObject.subdivision,
  debugObject.subdivision,
  debugObject.subdivision
)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * GUI
 */
// gui instance
const gui = new GUI({
  title: 'Cube GUI',
  width: 300
})
const cubeGUI = gui.addFolder('Awesome cube')

window.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    gui.show(gui._hidden)
  }
})

// tweaks
cubeGUI
  .add(mesh.position, 'y')
  .min(-1)
  .max(1)
  .step(0.01)
  .name('elevation')
cubeGUI
  .add(mesh, 'visible')
cubeGUI
  .add(material, 'wireframe')

// color tweak
cubeGUI
  .addColor(debugObject, 'color')
  .onChange((val) => {
    debugObject.color = val
    material.color.set(debugObject.color)
  })

// spin tweak
debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 2 })
}
cubeGUI
  .add(debugObject, 'spin')

// subdivision tweak
cubeGUI
  .add(debugObject, 'subdivision')
  .min(1)
  .max(20)
  .onFinishChange((val) => {
    debugObject.subdivision = val
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
      1, 1, 1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    )
  })

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()