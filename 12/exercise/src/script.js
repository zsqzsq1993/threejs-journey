import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/matcaps/8.png')
texture.colorSpace = THREE.SRGBColorSpace

/**
 * Object
 */
const material = new THREE.MeshMatcapMaterial({ matcap: texture })
const fontLoader = new FontLoader()
fontLoader.load('/fonts/Outfit.json', (font) => {
  const textGeometry = new TextGeometry('Hello World', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments:12,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelOffset: 0,
    bevelSize: 0.02,
    bevelThickness: 0.03,
  })
  textGeometry.center()
  const textMesh = new THREE.Mesh(textGeometry, material)
  scene.add(textMesh)
})
fontLoader.load()

/**
 * Donuts
 */
Array(100).keys().forEach(() => {

  const donutGeometry = new THREE.TorusGeometry(0.5, 0.3, 16, 32)
  const donutMesh = new THREE.Mesh(donutGeometry, material)
  donutMesh.rotation.x = Math.random() * Math.PI
  donutMesh.rotation.y = Math.random() * Math.PI
  const seed = Math.random()
  donutMesh.scale.set(seed, seed, seed)
  donutMesh.position.x = (Math.random() - 0.5) * 10
  donutMesh.position.y = (Math.random() - 0.5) * 10
  donutMesh.position.z = (Math.random() - 0.5) * 10
  scene.add(donutMesh)
})

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