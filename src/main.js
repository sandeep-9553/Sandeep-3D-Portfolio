import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// =====================================================
// 1. SCENE, CAMERA AND RENDERER
// =====================================================

const scene = new THREE.Scene()

scene.background = new THREE.Color(0x07111b)
scene.fog = new THREE.FogExp2(0x101b26, 0.010)

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  250
)

// CAMERA MOVEMENT PATH
const cameraPath = [

  // Opening: close to cabin doorway
  {
    position: new THREE.Vector3(0, 2.15, 7.2),
    target: new THREE.Vector3(0, 2.0, 0)
  },

  // Move backwards from doorway
  {
    position: new THREE.Vector3(0, 2.35, 10.5),
    target: new THREE.Vector3(0, 2.4, 0)
  },

  // Reveal cabin
  {
    position: new THREE.Vector3(-2.5, 3.0, 15.5),
    target: new THREE.Vector3(0, 2.7, 0)
  },

  // Forest overview
  {
    position: new THREE.Vector3(0, 5.0, 24),
    target: new THREE.Vector3(0, 2.8, 0)
  },

  // Side angle
  {
    position: new THREE.Vector3(7, 4.5, 21),
    target: new THREE.Vector3(0, 2.7, 0)
  },

  // Final wide view
  {
    position: new THREE.Vector3(0, 7, 32),
    target: new THREE.Vector3(0, 2.8, 0)
  }

]

let scrollProgress = 0
let smoothProgress = 0

const lookTarget = new THREE.Vector3()
const baseCameraPosition = new THREE.Vector3()
const baseLookTarget = new THREE.Vector3()

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
})

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.5)
)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2

document.querySelector('#scene').appendChild(
  renderer.domElement
)


// SCROLL PROGRESS

function updateScroll() {

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight

  scrollProgress = maxScroll > 0
    ? window.scrollY / maxScroll
    : 0

}

window.addEventListener(
  'scroll',
  updateScroll,
  { passive: true }
)

updateScroll()


// CAMERA INTERPOLATION

function updateCamera(progress) {

  const segmentCount = cameraPath.length - 1

  const scaled =
    THREE.MathUtils.clamp(progress, 0, 1) * segmentCount

  const index = Math.min(
    Math.floor(scaled),
    segmentCount - 1
  )

  const local = scaled - index

  const t = local * local * (3 - 2 * local)

  const start = cameraPath[index]
  const end = cameraPath[index + 1]

  baseCameraPosition.lerpVectors(
    start.position,
    end.position,
    t
  )

  baseLookTarget.lerpVectors(
    start.target,
    end.target,
    t
  )

}


// =====================================================
// 2. LIGHTING
// =====================================================

const moon = new THREE.DirectionalLight(
  0x9bbcff,
  2.5
)

moon.position.set(-15, 25, 10)

moon.castShadow = true

moon.shadow.mapSize.set(2048, 2048)

moon.shadow.camera.left = -35
moon.shadow.camera.right = 35
moon.shadow.camera.top = 35
moon.shadow.camera.bottom = -35

scene.add(moon)


scene.add(
  new THREE.HemisphereLight(
    0x8199c5,
    0x182016,
    1.2
  )
)


const blueFill = new THREE.PointLight(
  0x314e80,
  45,
  55
)

blueFill.position.set(-15, 8, -10)

scene.add(blueFill)


const lightningLight = new THREE.PointLight(
  0xdceaff,
  0,
  120,
  1.5
)

lightningLight.position.set(-12, 22, -10)

scene.add(lightningLight)


// =====================================================
// 3. GROUND AND SCATTERED STONES
// =====================================================

const groundGeometry = new THREE.PlaneGeometry(
  160,
  160,
  100,
  100
)

groundGeometry.rotateX(-Math.PI / 2)

const groundPositions =
  groundGeometry.attributes.position

for (
  let i = 0;
  i < groundPositions.count;
  i++
) {

  const x = groundPositions.getX(i)
  const z = groundPositions.getZ(i)

  const distance = Math.sqrt(x * x + z * z)

  const fade = THREE.MathUtils.smoothstep(
    distance,
    5,
    22
  )

  const variation =
    Math.sin(x * 0.18) *
    Math.cos(z * 0.15) * 0.55 +

    Math.sin(x * 0.37 + z * 0.2) * 0.18

  groundPositions.setY(
    i,
    variation * fade
  )

}

groundGeometry.computeVertexNormals()

const ground = new THREE.Mesh(
  groundGeometry,
  new THREE.MeshStandardMaterial({
    color: 0x273326,
    roughness: 0.9,
    metalness: 0
  })
)

ground.receiveShadow = true

scene.add(ground)


const stoneGeometry = new THREE.DodecahedronGeometry(1, 0)

const stoneMaterial = new THREE.MeshStandardMaterial({
  color: 0x333c3c,
  roughness: 0.95
})

for (let i = 0; i < 100; i++) {

  const angle = Math.random() * Math.PI * 2

  const distance = 8 + Math.random() * 38

  const stone = new THREE.Mesh(
    stoneGeometry,
    stoneMaterial
  )

  stone.position.set(
    Math.cos(angle) * distance,
    0.12,
    Math.sin(angle) * distance
  )

  const scale = 0.15 + Math.random() * 0.55

  stone.scale.set(
    scale * 1.4,
    scale * 0.55,
    scale
  )

  stone.rotation.set(
    Math.random(),
    Math.random() * Math.PI,
    Math.random()
  )

  stone.castShadow = true
  stone.receiveShadow = true

  scene.add(stone)

}


// =====================================================
// 4. GLB MODEL LOADER
// =====================================================

const loader = new GLTFLoader()

function prepareModel(object) {

  object.traverse(child => {

    if (child.isMesh) {

      child.castShadow = true
      child.receiveShadow = true

    }

  })

}


function loadAsset(filename, targetHeight, callback) {

  loader.load(
    `/models/${filename}`,

    gltf => {

      const model = gltf.scene

      prepareModel(model)

      const bounds = new THREE.Box3().setFromObject(model)

      const size = new THREE.Vector3()

      bounds.getSize(size)

      if (size.y > 0) {

        model.scale.setScalar(
          targetHeight / size.y
        )

      }

      const scaledBounds =
        new THREE.Box3().setFromObject(model)

      const center = new THREE.Vector3()

      scaledBounds.getCenter(center)

      model.position.x -= center.x
      model.position.z -= center.z
      model.position.y -= scaledBounds.min.y

      console.log(`Loaded ${filename}`, size)

      callback?.(model)

    },

    undefined,

    error => {

      console.error(
        `Could not load /models/${filename}. Check the filename and folder.`,
        error
      )

    }

  )

}


// CABIN

loadAsset('cabin.glb', 7.5, model => {

  const cabin = model.clone(true)

  cabin.position.set(0, 0, 0)

  scene.add(cabin)


  const houseGlow = new THREE.PointLight(
    0xffa45d,
    65,
    18
  )

  houseGlow.position.set(0, 3.2, 0)

  scene.add(houseGlow)


  const porchGlow = new THREE.PointLight(
    0xffa14b,
    35,
    10
  )

  porchGlow.position.set(3, 2, 5)

  scene.add(porchGlow)

})


// PINE TREES

loadAsset('pine.glb', 8.5, model => {

  const locations = [

    [-12, -9],
    [-17, -3],
    [-21, 8],
    [-13, 13],
    [-8, 19],
    [-3, 24],

    [9, -15],
    [15, -10],
    [21, -5],
    [23, 7],
    [16, 14],
    [10, 20],

    [-25, -15],
    [-30, 0],
    [-28, 17],
    [29, -18],
    [31, 2],
    [28, 19],

    [-5, -23],
    [6, -25],
    [19, -26]

  ]

  locations.forEach(([x, z]) => {

    const tree = model.clone(true)

    tree.position.set(x, 0, z)

    tree.scale.multiplyScalar(
      0.78 + Math.random() * 0.45
    )

    tree.rotation.y =
      Math.random() * Math.PI * 2

    scene.add(tree)

  })

})


// GROUPS OF PINE TREES

loadAsset('pine-trio.glb', 9, model => {

  ;[[-23, -22], [24, 24], [-30, 27]]
    .forEach(([x, z]) => {

      const group = model.clone(true)

      group.position.set(x, 0, z)

      group.rotation.y =
        Math.random() * Math.PI * 2

      scene.add(group)

    })

})
// =====================================================
// 5. STAIRS, LANTERN, GRASS AND ROCKS
// =====================================================

// STAIRS / PATH

loadAsset('stairs.glb', 3.5, model => {

  const stairs = model.clone(true)

  stairs.position.set(0, 0, 5)
  stairs.rotation.y = Math.PI

  scene.add(stairs)

})


// LANTERN

loadAsset('lamp.glb', 1.2, model => {

  const lamp = model.clone(true)

  lamp.position.set(4, 0, 4)

  scene.add(lamp)

  const lanternGlow = new THREE.PointLight(
    0xffa34a,
    28,
    11,
    2
  )

  lanternGlow.position.set(4, 1.2, 4)

  scene.add(lanternGlow)

})


// GRASS

loadAsset('grass.glb', 1.1, model => {

  for (let i = 0; i < 45; i++) {

    const angle = Math.random() * Math.PI * 2

    const distance = 6 + Math.random() * 30

    const grass = model.clone(true)

    grass.position.set(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    )

    grass.scale.multiplyScalar(
      0.7 + Math.random() * 0.7
    )

    grass.rotation.y =
      Math.random() * Math.PI * 2

    scene.add(grass)

  }

})


// OPTIONAL ROCKS MODEL
// Remove this block if rocks.glb is unavailable.

loadAsset('rocks.glb', 1.8, model => {

  for (let i = 0; i < 35; i++) {

    const angle = Math.random() * Math.PI * 2

    const distance = 8 + Math.random() * 28

    const rock = model.clone(true)

    rock.position.set(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    )

    rock.scale.multiplyScalar(
      0.55 + Math.random() * 1.1
    )

    rock.rotation.y =
      Math.random() * Math.PI * 2

    scene.add(rock)

  }

})


// =====================================================
// 6. RAIN AND MIST
// =====================================================

// RAIN

const rainCount = 1800

const rainGeometry = new THREE.BufferGeometry()

const rainPositions =
  new Float32Array(rainCount * 3)

for (let i = 0; i < rainCount; i++) {

  rainPositions[i * 3] =
    (Math.random() - 0.5) * 90

  rainPositions[i * 3 + 1] =
    Math.random() * 35

  rainPositions[i * 3 + 2] =
    (Math.random() - 0.5) * 90

}

rainGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(rainPositions, 3)
)

const rain = new THREE.Points(
  rainGeometry,
  new THREE.PointsMaterial({
    color: 0xc9dcf2,
    size: 0.10,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  })
)

scene.add(rain)


function updateRain(delta) {

  const positions =
    rain.geometry.attributes.position

  for (let i = 0; i < rainCount; i++) {

    let y =
      positions.getY(i) - 20 * delta

    if (y < 0) {

      y = 25 + Math.random() * 12

      positions.setX(
        i,
        (Math.random() - 0.5) * 90
      )

      positions.setZ(
        i,
        (Math.random() - 0.5) * 90
      )

    }

    positions.setY(i, y)

  }

  positions.needsUpdate = true

}


// MIST

const mistPositions = []

for (let i = 0; i < 160; i++) {

  mistPositions.push(
    (Math.random() - 0.5) * 90,
    Math.random() * 5 + 0.5,
    (Math.random() - 0.5) * 90
  )

}

const mistGeometry = new THREE.BufferGeometry()

mistGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(mistPositions, 3)
)

const mist = new THREE.Points(
  mistGeometry,
  new THREE.PointsMaterial({
    color: 0x9baec2,
    size: 0.12,
    transparent: true,
    opacity: 0.24,
    depthWrite: false
  })
)

scene.add(mist)


// =====================================================
// 7. SOUND SYSTEM
// =====================================================

// The browser may block automatic audio.
// We attempt playback immediately and retry after interaction.

const music = new Audio('/audio/forest-music.mp3')

const rainAudio = new Audio('/audio/rain.mp3')

const thunderAudio = new Audio('/audio/thunder.mp3')

const birdsAudio = new Audio('/audio/birds.mp3')


music.loop = true
rainAudio.loop = true

music.volume = 0.20
rainAudio.volume = 0.14
thunderAudio.volume = 0.40
birdsAudio.volume = 0.07


let soundEnabled = true
let soundStarted = false

let birdTimer = null
let thunderTimer = null

let audioStartAttempted = false


const soundButton =
  document.querySelector('#soundToggle')

const soundLabel =
  document.querySelector('#soundLabel')

const soundIcon =
  document.querySelector('#soundIcon')

const soundStatus =
  document.querySelector('#soundStatus')


function updateSoundUI(message = '') {

  soundButton.setAttribute(
    'aria-pressed',
    String(soundEnabled)
  )

  soundLabel.textContent =
    soundEnabled ? 'SOUND ON' : 'SOUND OFF'

  soundIcon.textContent =
    soundEnabled ? '♫' : '♪'

  if (soundStatus) {
    soundStatus.textContent = message
  }

}


// BIRD SOUND INTERVAL

function scheduleBirds() {

  clearTimeout(birdTimer)

  if (!soundEnabled || !soundStarted) return

  birdTimer = setTimeout(async () => {

    if (!soundEnabled) return

    try {

      birdsAudio.currentTime = 0

      await birdsAudio.play()

    } catch (error) {

      console.warn(
        'Bird audio could not play:',
        error
      )

    }

    scheduleBirds()

  }, 18000 + Math.random() * 22000)

}


// START AMBIENT AUDIO

async function startAmbientAudio() {

  if (!soundEnabled || soundStarted) return

  try {

    await Promise.all([
      music.play(),
      rainAudio.play()
    ])

    soundStarted = true

    updateSoundUI(
      'Forest ambience is playing'
    )

    scheduleBirds()

  } catch (error) {

    // Browser autoplay may be blocked.

    soundStarted = false

    updateSoundUI(
      'Tap or move on the page to start sound'
    )

    console.info(
      'Autoplay was blocked by the browser; waiting for visitor interaction.'
    )

  }

}


// START AUDIO AFTER FIRST INTERACTION

function startAudioOnFirstInteraction(event) {

  if (!soundEnabled || soundStarted) return

  // Avoid conflicting with the sound button's own click.

  if (
    event?.target?.closest?.('#soundToggle')
  ) {
    return
  }

  startAmbientAudio()

}

;[
  'pointerdown',
  'keydown',
  'touchstart'
].forEach(eventName => {

  window.addEventListener(
    eventName,
    startAudioOnFirstInteraction,
    { passive: true }
  )

})


// TRY TO PLAY WHEN PAGE LOADS

if (!audioStartAttempted) {

  audioStartAttempted = true

  startAmbientAudio()

}


// SOUND BUTTON

soundButton.addEventListener(
  'click',
  async () => {

    if (soundEnabled) {

      soundEnabled = false
      soundStarted = false

      music.pause()
      rainAudio.pause()
      birdsAudio.pause()
      thunderAudio.pause()

      clearTimeout(birdTimer)
      clearTimeout(thunderTimer)

      updateSoundUI(
        'Forest ambience is off'
      )

    } else {

      soundEnabled = true

      updateSoundUI(
        'Starting forest ambience...'
      )

      await startAmbientAudio()

      if (!soundStarted) {

        updateSoundUI(
          'Tap again if your browser blocked sound'
        )

      }

    }

  }
)


// =====================================================
// 8. LIGHTNING AND THUNDER
// =====================================================

function playThunderAfterLightning() {

  if (!soundEnabled || !soundStarted) return

  clearTimeout(thunderTimer)

  thunderTimer = setTimeout(() => {

    if (!soundEnabled || !soundStarted) return

    thunderAudio.currentTime = 0

    thunderAudio.play().catch(error => {

      console.warn(
        'Thunder audio:',
        error
      )

    })

  }, 1400 + Math.random() * 1800)

}


function flashLightning() {

  const flashes = [
    0.45,
    2.7,
    0.7,
    0.12,
    1.2,
    0
  ]

  let index = 0

  function nextFlash() {

    if (index >= flashes.length) {

      lightningLight.intensity = 0

      return

    }

    lightningLight.intensity =
      flashes[index++]

    setTimeout(
      nextFlash,
      75 + Math.random() * 95
    )

  }

  nextFlash()

  playThunderAfterLightning()

  setTimeout(
    flashLightning,
    9000 + Math.random() * 16000
  )

}

setTimeout(flashLightning, 5000)
// =====================================================
// 8. SMOOTH CUSTOM CURSOR + MOUSE-DRIVEN CAMERA
// =====================================================

const cursor = document.querySelector('.cursor-ring')
const cursorDot = document.querySelector('.cursor-dot')

const mouse = {
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0
}

const pointer = {
  x: 0,
  y: 0
}


// TRACK MOUSE POSITION

window.addEventListener(
  'pointermove',
  event => {

    pointer.x =
      (event.clientX / window.innerWidth) * 2 - 1

    pointer.y =
      (event.clientY / window.innerHeight) * 2 - 1

    mouse.x = event.clientX
    mouse.y = event.clientY

  },
  { passive: true }
)


// CURSOR HOVER EFFECT

document.querySelectorAll(
  'a, button, .project-card'
).forEach(element => {

  element.addEventListener(
    'mouseenter',
    () => cursor?.classList.add('cursor-hover')
  )

  element.addEventListener(
    'mouseleave',
    () => cursor?.classList.remove('cursor-hover')
  )

})


// UPDATE CUSTOM CURSOR

function updateCursor(delta) {

  const easing =
    1 - Math.pow(0.001, delta)

  mouse.smoothX +=
    (mouse.x - mouse.smoothX) * easing

  mouse.smoothY +=
    (mouse.y - mouse.smoothY) * easing

  if (cursor) {

    cursor.style.transform =
      `translate3d(${mouse.smoothX}px, ${mouse.smoothY}px, 0) translate(-50%, -50%)`

  }

  if (cursorDot) {

    cursorDot.style.transform =
      `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`

  }

}


// MOUSE-RESPONSIVE CAMERA

const smoothPointer = new THREE.Vector2()

function updateMouseCamera(delta) {

  smoothPointer.x = THREE.MathUtils.damp(
    smoothPointer.x,
    pointer.x,
    3.0,
    delta
  )

  smoothPointer.y = THREE.MathUtils.damp(
    smoothPointer.y,
    pointer.y,
    3.0,
    delta
  )

  // Gentle perspective movement.

  const strength =
    1 - Math.min(scrollProgress * 0.25, 0.25)

  camera.position.x =
    baseCameraPosition.x +
    smoothPointer.x * 1.05 * strength

  camera.position.y =
    baseCameraPosition.y -
    smoothPointer.y * 0.48 * strength

  camera.position.z =
    baseCameraPosition.z

  lookTarget.set(

    baseLookTarget.x +
    smoothPointer.x * 0.55,

    baseLookTarget.y -
    smoothPointer.y * 0.28,

    baseLookTarget.z

  )

  camera.lookAt(lookTarget)

}


// =====================================================
// 9. PROJECT AND CERTIFICATE MODALS
// =====================================================

const modal =
  document.querySelector('#contentModal')

const modalBody =
  document.querySelector('#modalBody')

const modalClose =
  document.querySelector('#modalClose')


// PROJECT INFORMATION

const projects = {

  studentos: {

    title: 'StudentOS',

    subtitle: 'Student Productivity Platform',

    description:
      'A student productivity platform combining expense tracking, smart timetable planning and career roadmap generation. The modules help students organize money, study time and career preparation in one place.',

    technology:
      'Python · Streamlit · Pandas · SQLite',

    images: [
      '/image/projects/studentos_1.png',
      '/image/projects/studentos_2.png'
    ],

    github:
      'https://github.com/sandeep-9553'

  },


  aws: {

    title: 'AWS Two-Tier Web Application',

    subtitle: 'Cloud Infrastructure Project',

    description:
      'A PHP and MySQL web application deployed using AWS EC2 instances in a VPC with public and private subnets. The project demonstrates application-to-database communication and cloud networking.',

    technology:
      'AWS · EC2 · VPC · PHP · MySQL · Linux',

    images: [
      '/image/projects/aws_1.png',
      '/image/projects/aws_2.png'
    ],

    github:
      'https://github.com/sandeep-9553'

  },


  s3: {

    title: 'Static Website on AWS S3',

    subtitle: 'Cloud Hosting Project',

    description:
      'A static website hosted using Amazon S3, demonstrating object storage, static website hosting and deployment of website files to the cloud.',

    technology:
      'AWS S3 · HTML · CSS · GitHub',

    images: [
      '/image/projects/s3_1.png',
      '/image/projects/s3_2.png'
    ],

    github:
      'https://github.com/sandeep-9553/website-deploy-using-s3-service'

  }

}


// OPEN MODAL

function showModal() {

  modal.classList.add('modal-open')

  modal.setAttribute(
    'aria-hidden',
    'false'
  )

  document.body.classList.add(
    'modal-active'
  )

  modalClose.focus()

}


// OPEN PROJECT DETAILS

function openProject(id) {

  const project = projects[id]

  if (!project) return

  modalBody.innerHTML = `

    <div class="modal-eyebrow">
      PROJECT DETAILS
    </div>

    <h2 id="modalTitle">
      ${project.title}
    </h2>

    <p class="modal-subtitle">
      ${project.subtitle}
    </p>

    <p class="modal-description">
      ${project.description}
    </p>

    <p class="modal-tech">
      ${project.technology}
    </p>

    <div class="modal-gallery">

      ${project.images.map((src, index) => `

        <img
          src="${src}"
          alt="${project.title} screenshot ${index + 1}"
          loading="lazy">

      `).join('')}

    </div>

    <p class="modal-note">
      Project screenshots and implementation evidence.
    </p>

    <a
      class="modal-link"
      href="${project.github}"
      target="_blank"
      rel="noopener noreferrer">

      VIEW PROJECT ON GITHUB ↗

    </a>

  `

  showModal()

}


// OPEN CERTIFICATES

function openCertificates() {

  modalBody.innerHTML = `

    <div class="modal-eyebrow">
      MY ACHIEVEMENTS
    </div>

    <h2 id="modalTitle">
      Certificates
    </h2>

    <p class="modal-description">
      Courses, learning achievements and certifications.
    </p>

    <div class="certificate-grid">

      ${Array.from(
        { length: 8 },
        (_, index) => `

          <a
            href="/image/certificates/certificate_${index + 1}.jpeg"
            target="_blank"
            rel="noopener noreferrer">

            <img
              src="/image/certificates/certificate_${index + 1}.jpeg"
              alt="Certificate ${index + 1}"
              loading="lazy">

            <span>
              Certificate ${index + 1}
            </span>

          </a>

        `
      ).join('')}

    </div>

  `

  showModal()

}


// CLOSE MODAL

function closeModal() {

  modal.classList.remove('modal-open')

  modal.setAttribute(
    'aria-hidden',
    'true'
  )

  document.body.classList.remove(
    'modal-active'
  )

}


// PROJECT BUTTON EVENTS

document.querySelectorAll(
  '[data-project]'
).forEach(button => {

  button.addEventListener(
    'click',
    () => openProject(button.dataset.project)
  )

})


// CERTIFICATE BUTTON

document.querySelector(
  '#certificateButton'
)?.addEventListener(
  'click',
  openCertificates
)


// CLOSE BUTTON

modalClose.addEventListener(
  'click',
  closeModal
)


// CLOSE WHEN CLICKING OUTSIDE

modal.addEventListener(
  'click',
  event => {

    if (event.target === modal) {
      closeModal()
    }

  }
)


// CLOSE USING ESCAPE KEY

window.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      modal.classList.contains('modal-open')
    ) {

      closeModal()

    }

  }
)


// =====================================================
// 10. ANIMATION LOOP
// =====================================================

function animate() {

  requestAnimationFrame(animate)

  const delta = Math.min(
    clock.getDelta(),
    0.05
  )

  const elapsed = clock.elapsedTime


  // Smooth scroll-based camera movement.

  smoothProgress = THREE.MathUtils.damp(
    smoothProgress,
    scrollProgress,
    2.5,
    delta
  )

  updateCamera(smoothProgress)


  // Mouse-responsive perspective.

  updateMouseCamera(delta)


  // Rain animation.

  updateRain(delta)


  // Slowly moving forest mist.

  mist.position.x =
    Math.sin(elapsed * 0.08) * 1.5


  // Gentle lighting variation.

  blueFill.intensity =
    45 + Math.sin(elapsed * 0.4) * 2


  // Custom cursor.

  updateCursor(delta)


  // Render scene.

  renderer.render(scene, camera)

}

animate()


// =====================================================
// 11. RESPONSIVE RESIZE
// =====================================================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5)
    )

  }
)