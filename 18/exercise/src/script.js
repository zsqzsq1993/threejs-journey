import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const params = {}
params.count = 100000
params.size = 0.01
params.branch = 3
params.radius = 5
params.spin = 1.1
params.randomness = 0.18
params.randomnessPow = 2
params.insideColor = '#ff6030'
params.outsideColor = '#1b3984'

gui.add(params, 'count').min(1000).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(params, 'size').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(params, 'branch').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(params, 'radius').min(2).max(4).step(0.1).onFinishChange(generateGalaxy)
gui.add(params, 'spin').min(0.1).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(params, 'randomness').min(0.1).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(params, 'randomnessPow').min(1).max(10).step(0.1).onFinishChange(generateGalaxy)

let geometry = null
let material = null
let points = null

function generateGalaxy () {
  if (points) {
    geometry?.dispose()
    material?.dispose()
    scene.remove(points)
  }

  geometry = new THREE.BufferGeometry()
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })

  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)

  Array(params.count).keys().forEach((_, index) => {
    const i3 = index * 3

    // positions
    const radius = Math.random() * params.radius
    const branchRadian = ((index % params.branch) / params.branch) * Math.PI * 2
    const spinRadian = radius * params.spin

    const randomX
      = Math.pow(Math.random(), params.randomnessPow) * (Math.random() > 0.5 ? 1 : -1) * params.randomness * radius
    const randomY
      = Math.pow(Math.random(), params.randomnessPow) * (Math.random() > 0.5 ? 1 : -1) * params.randomness * radius
    const randomZ
      = Math.pow(Math.random(), params.randomnessPow) * (Math.random() > 0.5 ? 1 : -1) * params.randomness * radius

    positions[i3] = Math.sin(branchRadian + spinRadian) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.cos(branchRadian + spinRadian) * radius + randomZ

    // colors
    const color = new THREE.Color(params.insideColor).lerp(
      new THREE.Color(params.outsideColor),
      radius / params.radius
    )
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  })
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  points = new THREE.Points(
    geometry,
    material 
  )
  scene.add(points)
}

generateGalaxy()

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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