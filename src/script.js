import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load(
	'/textures/particles/10.png',
	(texture) => console.log(texture)
)

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load('/fonts/gentilis_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry(
		'Welcome to the Metaverse Team Jody Thoele!',
		{
			font: font,
			size: 0.3,
			height: 0.2,
			curveSegments: 4,
			bevelEnabled: true,
			bevelThickness: 0.03,
			bevelSize: 0.02,
			bevelOffset: 0,
			bevelSegments: 4,
		}
	)

	const text = new THREE.Mesh(textGeometry, new THREE.MeshNormalMaterial())
	textGeometry.center()
	scene.add(text)
})

/**
 * Particles
 */

// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 10
	colors[i] = Math.random()
}
particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.1,
	sizeAttenuation: true,
})
particlesMaterial.alphaMap = particleTexture
particlesMaterial.transparent = true
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
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
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update particles
	particles.rotation.x = elapsedTime * 0.05

	// Wrong way to animate. Should use custom shader instead!
	// for (let i = 0; i < count; i++) {
	// 	const i3 = i * 3
	// 	const x = particlesGeometry.attributes.position.array[i3]

	// 	// Get the y value
	// 	particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
	// 		elapsedTime + x
	// 	)
	// }
	// particlesGeometry.attributes.position.needsUpdate = true

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
