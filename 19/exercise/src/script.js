import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights
const light = new THREE.DirectionalLight(0xffffff)
light.position.set(1, 1, 0)
scene.add(light)

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Material
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture
})

/**
 * Objects
 */
// Init mesh
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)

const meshes = [mesh1, mesh2, mesh3]
scene.add(mesh1, mesh2, mesh3)

// Init position
const distance = 6

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

meshes.forEach((mesh, index) => {
  mesh.position.y = - index * distance
})

/**
 * Particles
 */
// Geometry
const particleCount = 2000
const particleGeometry = new THREE.BufferGeometry()
const positions = new Float32Array(particleCount * 3)
const colors = new Float32Array(particleCount * 3)

Array(particleCount).keys().forEach(index => {
  const i3 = index * 3

  positions[i3] = (Math.random() - 0.5) * 6
  positions[i3 + 1] = 0.5 * distance - Math.random() * distance * 3
  positions[i3 + 2] = (Math.random() - 0.5) * 2

  colors[i3] = Math.random()
  colors[i3 + 1] = Math.random()
  colors[i3 + 2] = Math.random()
})

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const points = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite: false
  })
)
scene.add(points)

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
const cameraGroup = new THREE.Group()
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(cameraGroup)
cameraGroup.add(camera)

// Scroll
let prevMeshIndex = 0
window.addEventListener('scroll', () => {
  camera.position.y = - (window.scrollY / sizes.height) * distance

  const currentMeshIndex = Math.round(window.scrollY / sizes.height)
  if (currentMeshIndex !== prevMeshIndex) {
    prevMeshIndex = currentMeshIndex
    gsap.to(
      meshes[currentMeshIndex].rotation,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5'
      }
    )
  }
})

// Parallax
const parallax = {
  deltaX: 0,
  deltaY: 0
}
window.addEventListener('mousemove', (event) => {
  parallax.deltaX = (event.clientX / sizes.width - 0.5) /2
  parallax.deltaY = (0.5 - event.clientY / sizes.height) / 2
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = clock.getElapsedTime()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - previousTime
    previousTime = elapsedTime

    // Rotates
    meshes.forEach(mesh => {
      mesh.rotation.x += 0.1 * delta
      mesh.rotation.y += 0.2 * delta
    })

    // Parallax
    cameraGroup.position.x += (parallax.deltaX - cameraGroup.position.x) * delta * 5
    cameraGroup.position.y += (parallax.deltaY - cameraGroup.position.y) * delta * 5

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()