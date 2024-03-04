import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Gui
 */
const gui = new GUI()
const lightGui = gui.addFolder('Lights')
const houseGui = gui.addFolder('House')

/**
 * Global
 */
const globalColor = {
  fog: '#262837',
  ambient: '#b9d5ff',
  ghost1: '#ff00ff',
  ghost2: '#00ffff',
  ghost3: '#ffff00'
}

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(globalColor.fog, 1, 15)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Grass
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')

grassColorTexture.colorSpace = THREE.SRGBColorSpace

grassColorTexture.repeat.x = 8
grassColorTexture.repeat.y = 8
grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping

grassNormalTexture.repeat.x = 8
grassNormalTexture.repeat.y = 8
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping

grassRoughnessTexture.repeat.x = 8
grassRoughnessTexture.repeat.y = 8
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

grassAmbientOcclusionTexture.repeat.x = 8
grassAmbientOcclusionTexture.repeat.y = 8
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping

// Bricks
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

bricksColorTexture.colorSpace = THREE.SRGBColorSpace

// Door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Lights
 */
// Ambient
const ambientLight = new THREE.AmbientLight(globalColor.ambient, 0.1)
scene.add(ambientLight)

lightGui.add(ambientLight, 'intensity').min(0.01).max(1).step(0.01)

// Moon
const moonLight = new THREE.DirectionalLight(globalColor.ambient, 0.12)
moonLight.position.set(4, 6, 0)
scene.add(moonLight)

lightGui.add(moonLight, 'intensity').min(0.01).max(1).step(0.01)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 3, 7)
doorLight.position.set(0, 2.8, 4)
scene.add(doorLight)

// Ghost
const ghost = new THREE.PointLight()
ghost.intensity = 6
ghost.distance = 3

const ghost1 = ghost.clone()
ghost1.color = new THREE.Color(globalColor.ghost1)
scene.add(ghost1)

const ghost2 = ghost.clone()
ghost2.color = new THREE.Color(globalColor.ghost2)
scene.add(ghost2)

const ghost3 = ghost.clone()
ghost3.color = new THREE.Color(globalColor.ghost3)
scene.add(ghost3)

/**
 * Objects
 */
// Grass floor
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(32, 32, 32, 32),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    normalScale: new THREE.Vector2(.5, .5),
    roughnessMap: grassRoughnessTexture,
    aoMap: grassAmbientOcclusionTexture,
    aoMapIntensity: 1,
  })
)
plane.rotation.x = - Math.PI / 2
scene.add(plane)

// House
const house = new THREE.Group()
scene.add(house)

// House - walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(5, 3, 5, 32, 32, 32),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
    aoMap: bricksAmbientOcclusionTexture,
  })
)
walls.position.y = 3 / 2
house.add(walls)

// House - roof
const roofParam = { color: '#b35f45' }
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4.2, 1, 4, 2),
  new THREE.MeshStandardMaterial({
    color: '#b35f45'
  })
)
roof.position.y = 3.5
roof.rotation.y = Math.PI / 4
house.add(roof)

houseGui.addColor(roofParam, 'color').name('roofColor').onChange((val) => {
  roof.material.color = new THREE.Color(val)
})

// House - door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.4, 2.4, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    roughnessMap: doorRoughnessTexture,
    transparent: true,
    displacementScale: 0.1,
  })
)
door.position.set(0, 1.15, 2.55)
house.add(door)

// House - bushes
const bush = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: '#89c854' })
)

const bush1 = bush.clone()
bush1.scale.set(1, 1, 1)
bush1.position.set(1.2, 0.2, 2.5)
house.add(bush1)

const bush2 = bush.clone()
bush2.scale.set(0.3, 0.3, 0.3)
bush2.position.set(1.9, 0.2, 2.5)
house.add(bush2)

const bush3 = bush.clone()
bush3.scale.set(0.8, 0.8, 0.8)
bush3.position.set(-1.3, 0.2, 2.8)
house.add(bush3)

const bush4 = bush.clone()
bush4.scale.set(0.4, 0.4, 0.4)
bush4.position.set(-1.7, 0.2, 3.3)
house.add(bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const grave = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 0.3, 16, 32, 4),
  new THREE.MeshStandardMaterial({ color: '#b2b6b1' })
)
Array(50).keys().forEach(() => {
  const instance = grave.clone()
  const radian = Math.PI * 2 * Math.random()

  instance.position.x = (Math.random() * 7 + 3.6) * Math.sin(radian)
  instance.position.z = (Math.random() * 7 + 3.6) * Math.cos(radian)
  instance.position.y = Math.random() * 0.2 + 0.5

  instance.rotation.z = (Math.random() - 0.5) * 0.4
  instance.rotation.y = (Math.random() - 0.5) * 0.4

  instance.castShadow = true

  graves.add(instance)
})

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(5, 5, 7)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
renderer.setClearColor(globalColor.fog)

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
plane.receiveShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enablePan = false
controls.minDistance = 5
controls.maxDistance = 18
controls.maxPolarAngle = Math.PI / 2 - 0.3
controls.autoRotate = true

/**
 * Animation
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update ghost
  const radius1 = 5
  ghost1.position.x = radius1 * Math.cos(elapsedTime * 0.3)
  ghost1.position.z = radius1 * Math.sin(elapsedTime * 0.3)
  ghost1.position.y = Math.sin(elapsedTime * 0.2) + Math.sin(elapsedTime * 0.2 + Math.PI / 3)

  const radius2 = 7
  ghost2.position.x = radius2 * Math.cos(-elapsedTime * 0.6)
  ghost2.position.z = radius2 * Math.sin(-elapsedTime * 0.6)
  ghost2.position.y = Math.cos(elapsedTime * 0.3) + Math.cos(elapsedTime * 0.3 + Math.PI / 4)

  const radius3 = 9
  ghost3.position.x = radius3 * Math.cos(elapsedTime * 0.5)
  ghost3.position.z = radius3 * Math.sin(elapsedTime * 0.5)
  ghost3.position.y = Math.sin(elapsedTime * 0.4) + Math.cos(elapsedTime * 0.4 + Math.PI / 2)


  // Update controls
  controls.update()

  // Update renderer
  renderer.render(scene, camera)

  // Next tick
  window.requestAnimationFrame(tick)
}

tick()
