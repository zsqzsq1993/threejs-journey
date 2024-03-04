import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Global
 */
const debugObject = {
  material: 'MeshPhysicalMaterial',
  materials: [
    'MeshBasicMaterial',
    'MeshNormalMaterial', // 根据法线角度自动计算颜色
    'MeshMatcapMaterial', // 根据法线角度根据texture计算颜色
    'MeshLambertMaterial', // 基础光感材料，性能好
    'MeshPhongMaterial', // 进阶光感材料，有反射，shininess
    'MeshToonMaterial', // 卡通感材料
    'MeshStandardMaterial', // realistic material
    'MeshPhysicalMaterial'
  ],
  roughness: 0.2,
  metalness: 0.7,
  shininess: 100,
  specular: 0x1188ff
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(ambientLight, pointLight)

/**
 * Environmental Map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.environment = environmentMap
  scene.background = environmentMap
})

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager(
  () => {},
  () => {},
  (url) => { console.log(`Loading ${url} error.`) }
)
const textureLoader = new THREE.TextureLoader(loadingManager)
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('/textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture8 = textureLoader.load('/textures/matcaps/8.png')

doorColorTexture.colorSpace = THREE.SRGBColorSpace



/**
 * Objects
 */
// Material
const material = new THREE.MeshBasicMaterial()

// mesh
const group = new THREE.Group()

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
)
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
)

sphere.position.x = -1.5
torus.position.x = +1.5
plane.rotation.y = Math.PI / 2

group.add(sphere, plane, torus)
scene.add(group)

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
handleMaterialChange(debugObject.material)

const gui = new GUI({ title: 'Material Tweaks' })
gui
  .add(debugObject, 'material', debugObject.materials)
  .onChange((val) => {
    handleMaterialChange(val)  
  })

gui
  .add(debugObject, 'roughness')
  .min(0)
  .max(1)
  .step(0.001)
  .onChange((val) => {
    plane.material.roughness = val
  })

gui
  .add(debugObject, 'metalness')
  .min(0)
  .max(1)
  .step(0.001)
  .onChange((val) => {
    plane.material.metalness = val
  })

gui
  .add(debugObject, 'shininess')
  .min(0)
  .max(1000)
  .step(1)
  .onChange((val) => {
    plane.material.shininess = val
  })

gui
  .addColor(debugObject, 'specular')
  .onChange((val) => {
    plane.material.specular = new THREE.Color(val)
  })

function handleMaterialChange(val) {
  switch (val) {
    case 'MeshBasicMaterial':
      handleMeshBasicMaterial()
      break
    case 'MeshNormalMaterial':
      handleMeshNormalMaterial()
      break
    case 'MeshMatcapMaterial':
      handleMeshMatcapMaterial()
      break
    case 'MeshLambertMaterial':
      handleMeshLambertMaterial()
      break
    case 'MeshPhongMaterial':
      handleMeshPhongMaterial()
      break
    case 'MeshToonMaterial':
      handleMeshToonMaterial()
      break
    case 'MeshStandardMaterial':
      handleMeshStandardMaterial()
      break
    case 'MeshPhysicalMaterial':
      handleMeshPhysicalMaterial()
      break
  }
}
function handleMeshBasicMaterial() {
  const material = new THREE.MeshBasicMaterial()
  // material.map = doorColorTexture
  material.alphaMap = doorAlphaTexture
  material.side = THREE.DoubleSide
  material.transparent = true
  material.opacity = 0.2
  applyNewMaterial(material)
}
function handleMeshNormalMaterial() {
  const material = new THREE.MeshNormalMaterial()
  material.side = THREE.DoubleSide
  material.flatShading = true
  applyNewMaterial(material)
}
function handleMeshMatcapMaterial() {
  const material = new THREE.MeshMatcapMaterial()
  material.matcap = matcapTexture8
  material.side = THREE.DoubleSide
  material.flatShading = true
  applyNewMaterial(material)
}
function handleMeshLambertMaterial() {
  const material = new THREE.MeshLambertMaterial()
  material.side = THREE.DoubleSide
  applyNewMaterial(material)
}
function handleMeshPhongMaterial() {
  const material = new THREE.MeshPhongMaterial()
  material.side = THREE.DoubleSide
  applyNewMaterial(material)
}
function handleMeshToonMaterial() {
  const material = new THREE.MeshToonMaterial()
  material.side = THREE.DoubleSide
  material.gradientMap = gradientTexture
  gradientTexture.magFilter = THREE.NearestFilter
  gradientTexture.minFilter = THREE.NearestFilter
  gradientTexture.generateMipmaps = false
  applyNewMaterial(material)
}
function handleMeshStandardMaterial() {
  const material = new THREE.MeshStandardMaterial()
  material.side = THREE.DoubleSide
  material.roughness = 1
  material.metalness = 1

  material.map = doorColorTexture
  material.aoMap = doorAmbientTexture
  material.aoMapIntensity = 1
  material.displacementMap = doorHeightTexture
  material.displacementScale = 0.1
  material.metalnessMap = doorMetalnessTexture
  material.roughnessMap = doorRoughnessTexture
  material.normalMap = doorNormalTexture
  material.normalScale = new THREE.Vector2(.5, .5)
  material.transparent = true
  material.alphaMap = doorAlphaTexture
  applyNewMaterial(material)
}
function handleMeshPhysicalMaterial() {
  const material = new THREE.MeshPhysicalMaterial()
  material.side = THREE.DoubleSide
  material.roughness = 0
  material.metalness = 0

  // material.map = doorColorTexture
  // material.aoMap = doorAmbientTexture
  // material.aoMapIntensity = 1
  // material.displacementMap = doorHeightTexture
  // material.displacementScale = 0.1
  // material.metalnessMap = doorMetalnessTexture
  // material.roughnessMap = doorRoughnessTexture
  // material.normalMap = doorNormalTexture
  // material.normalScale = new THREE.Vector2(.5, .5)

  material.clearcoat = 1
  material.clearcoatRoughness = 0

  material.sheen = 1
  material.sheenRoughness = 0.25
  material.sheenColor.set(1, 1, 1)

  material.iridescence = 1
  material.iridescenceIOR = 1
  material.iridescenceThicknessRange = [100, 800]

  material.transmission = 1
  material.ior = 1.333
  material.thickness = 0.5
  applyNewMaterial(material)
}
function applyNewMaterial(material) {
  sphere.material.dispose()
  plane.material.dispose()
  torus.material.dispose()

  sphere.material = material
  plane.material = material
  torus.material = material
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    sphere.rotation.x = elapsedTime * 0.2
    plane.rotation.x = elapsedTime * 0.2
    torus.rotation.x = elapsedTime * 0.2

    sphere.rotation.y = elapsedTime * 0.15
    plane.rotation.y = elapsedTime * 0.15
    torus.rotation.y = elapsedTime * 0.15

    // Render
    renderer.render(scene, camera)
    controls.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()