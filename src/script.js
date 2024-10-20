import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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

let currentModelIntersect = null;

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (_event) => {
    mouse.x = ((_event.clientX / sizes.width) * 2) - 1
    mouse.y = -(((_event.clientY / sizes.height) * 2) - 1)
});

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click on object 1')
                break
            case object2:
                console.log('click on object 2')
                break
            case object3:
                console.log('click on object 2')
                break
            default:
                console.log('click on unknown object')
                break
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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

let model = null;
/**
 * Model
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load('./models/creditCard.glb', (gltf) => {
    gltf.scene.rotation.x = Math.PI * 0.5
    gltf.scene.scale.set(0.5, 0.5, 0.5)
    model = gltf.scene
    scene.add(gltf.scene)
})

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.7)
scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.7)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

/**
 * Witness
 */
let currentIntersect = null;

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.6) * 1.5
    object3.position.y = Math.sin(elapsedTime * 0.9) * 1.5

    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3];

    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }

    const intersects = raycaster.intersectObjects(objectsToTest)

    // for (const intersect of intersects) { 
    //     intersect.object.material.color.set('#0000ff')
    // }
    if (intersects?.length > 0) {
        if (currentIntersect === null) {
            console.log('mouse enter')
        } 
        intersects[0].object.material.color.set('#0000ff')
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    // Test intersect with model
    if (model) {
        const modelIntersects = raycaster.intersectObject(model)

        for (const obj of model.children) {
            obj.material.color.set('#ffffff')
        }

        if (modelIntersects?.length > 0 && intersects.length === 0) {
            if (currentModelIntersect === null) {
                console.log('mouse enter')
            } 
            // Card section selected on hover
            // modelIntersects[0].object.material.color.set('#0000ff')

            // Whole card seelcted on hover
            // for (const obj of model.children) {
            //     obj.material.color.set('#aaaaff')
            // }
            currentModelIntersect = intersects[0]
        } else {
            if (currentModelIntersect) {
                console.log('mouse leave')
            }
            currentModelIntersect = null
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()