import * as THREE from 'three'

// canvas
const canvas = document.querySelector('canvas.webgl')

// size
const width = 800
const height = 600

// scene
const scene = new THREE.Scene()

// object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// camera
const camera = new THREE.PerspectiveCamera(35, width/height)
camera.position.z = 3
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(width, height)

// animation
const tick = () => {
  renderer.render(scene, camera)
  mesh.rotation.z += 0.01
  mesh.rotation.x += 0.01

  requestAnimationFrame(tick)
}

tick()