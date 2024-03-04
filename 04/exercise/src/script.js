import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.x = 0.5
mesh.position.y = 0.5
mesh.position.z = 0.5
mesh.scale.x = 2
mesh.scale.y = 0.5
mesh.scale.z = 0.5
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI / 2
mesh.rotation.y = Math.PI / 4
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Axes
 */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.lookAt(mesh.position)
scene.add(camera)

/**
 * Information
 */
// mesh.position.normalize()

console.log(
  'Distance from mesh to camera:', 
  mesh.position.distanceTo(camera.position)
) 
console.log(
  'Distance from mesh to coord center',
  mesh.position.length()
)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
