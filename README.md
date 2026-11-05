# Sandeep's Interactive 3D Portfolio

[![Three.js](https://img.shields.io/badge/Three.js-r187-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/TR/css/)
[![License](https://img.shields.io/badge/License-Unspecified-lightgrey?style=for-the-badge)](#license)

An atmospheric, cinematic 3D web experience built with **Three.js** and **Vite**. The portfolio takes visitors on a nocturnal journey through a moonlit forest and a rustic cabin, blending real-time 3D graphics, dynamic weather simulations, interactive audio ambience, and custom 3D-styled book viewers.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
  - [3D Forest & Cabin Environment](#1-3d-forest--cabin-environment)
  - [Dynamic Weather & Atmosphere](#2-dynamic-weather--atmospheric-effects)
  - [Scroll & Mouse Camera Choreography](#3-scroll-choreographed-camera--mouse-parallax)
  - [Interactive 3D Book Viewer](#4-interactive-3d-book-viewer)
  - [Multi-Layered Ambient Audio System](#5-multi-layered-ambient-audio-system)
  - [Custom Cursor & UI Interactions](#6-custom-cursor--responsive-ui)
- [Featured Projects in the Portfolio](#-featured-projects-in-the-portfolio)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Installation and Setup](#-installation-and-setup)
- [Live Demo](#-live-demo)
- [Author & Contact](#-author--contact)
- [License](#-license)

---

## 🌲 Project Overview

**Sandeep's Interactive 3D Portfolio** moves away from conventional flat portfolio designs by embedding technical work within an interactive, living 3D world:

- **Nocturnal Forest Narrative**: The experience begins up-close at the warm doorway of a secluded cabin nestled in a deep pine forest. As visitors scroll, the camera dynamically glides backward and upward, revealing the surrounding misty landscape under moonlight.
- **Atmospheric Storytelling**: Rain particles descend through the woods, mist drifts across the ground, and lightning flashes illuminate the dark canopy, immediately followed by the distant rumble of thunder.
- **Tangible Document Viewing**: Instead of simple modal popups, visitors can open an interactive **3D skeuomorphic book** with flippable pages to inspect projects and certifications, or open an embedded reader to review Sandeep's resume.

---

## ✨ Key Features

### 1. 3D Forest & Cabin Environment
- **GLTF/GLB Asset Integration**: Loads optimized 3D models via Three.js `GLTFLoader`, including:
  - Detailed wooden cabin (`cabin.glb`) with warm interior and porch lantern lighting.
  - Pine trees and clustered groves (`pine.glb`, `pine-trio.glb`) procedurally distributed with randomized rotation and scaling.
  - Entrance stone stairway (`stairs.glb`), roadside vintage lamp post (`lamp.glb`), grass patches (`grass.glb`), and rocks (`rocks.glb`).
- **Procedural Undulating Terrain**: Generated from a 160×160 subdivided plane geometry using sinusoidal mathematical height displacement and computed vertex normals, surrounded by 100 scattered dodecahedron stone meshes with cast and receive shadows.
- **Cinematic Lighting & Shadow Mapping**:
  - Cool directional moonlight (`0x9bbcff`) with high-resolution `PCFSoftShadowMap` (2048×2048 shadow maps).
  - Dual-color hemisphere light (`0x8199c5` sky / `0x182016` ground) for subtle natural fill.
  - Deep blue fill point light (`0x314e80`) adding depth to the backwoods.
  - Warm orange point lights placed inside the cabin (`0xffa45d`), on the porch (`0xffa14b`), and inside the lantern (`0xffa34a`).
  - ACES Filmic tone mapping and sRGB color space rendering.

### 2. Dynamic Weather & Atmospheric Effects
- **Real-Time Rainfall Simulation**: 1,800 translucent particle raindrops rendered via `THREE.Points` and `THREE.BufferGeometry`, continuously descending with delta-time velocity and looping seamlessly.
- **Drifting Lowland Mist**: 160 suspended mist particles gently oscillating horizontally across the ground layer to simulate forest fog.
- **Procedural Lightning & Thunder**:
  - A dedicated high-intensity point light (`0xdceaff`) triggers realistic multi-burst flash sequences at random intervals (every 9 to 25 seconds).
  - An asynchronous timer calculates sound travel delay and triggers the thunder audio track (`thunder.mp3`) shortly after each lightning strike.

### 3. Scroll-Choreographed Camera & Mouse Parallax
- **Scroll-Driven Keyframe Spline**: The camera interpolates along a 6-stage waypoint trajectory (`cameraPath`) using smooth Hermite spline equations (`t * t * (3 - 2 * t)`). Scrolling moves the perspective through distinct vantage points:
  1. *Opening*: Intimate focus at the cabin doorway.
  2. *Threshold*: Slow backward retreat revealing the stairs.
  3. *Cabin Reveal*: Low-angle showcase of the illuminated cabin architecture.
  4. *Forest Overview*: Ascending view over the pine canopy.
  5. *Side Angle*: Angled perspective over the wooded grounds.
  6. *Wide Vista*: Elevated panoramic vista across the entire forest.
- **Mouse Parallax Dynamics**: Smoothly dampens pointer coordinates to apply gentle interactive camera offsets and target tracking without disrupting the scroll path.

### 4. Interactive 3D Book Viewer
- **Skeuomorphic 3D Book Model**:
  - Modeled using layered HTML and 3D CSS transforms (`preserve-3d`, `perspective: 1800px`, dynamic lighting gradients, and embossed covers).
  - Realistic book anatomy with front/back covers, textured spine, stacked paper edges, and dual-page spreads.
  - Smooth page-flip animations (`turn-forward` and `turn-backward`) simulating physical paper turning.
- **Navigation Controls**:
  - Touch/pointer drag gesture detection (swipe left/right to flip pages).
  - Dedicated Previous / Next buttons with page counter indicators.
  - Full keyboard navigation support (`ArrowLeft`, `ArrowRight`, and `Escape` to close).
- **Curated Content Spreads**:
  - **Selected Projects**: Showcases in-depth project field notes, tech stack breakdowns, screenshot galleries, and GitHub repository links.
  - **Learning Journal (Certificates)**: Displays 8 verified certifications across structured 2-up spreads with direct links to full-size view.
  - **Resume Viewer**: Framed CV viewer with embedded PDF display and instant download link.

### 5. Multi-Layered Ambient Audio System
- **Layered Soundscapes**:
  - Looping ambient forest soundtrack (`forest-music.mp3`) balanced at 20% volume.
  - Looping continuous rainfall (`rain.mp3`) balanced at 14% volume.
  - Randomized bird chirping (`birds.mp3`) periodically scheduled every 18–40 seconds.
  - Lightning-synchronized thunder strikes (`thunder.mp3`).
- **Autoplay Compliance & Controls**:
  - Floating UI control button (`#soundToggle`) reflecting live audio state.
  - Automatic browser policy handling: attempts playback on load, and seamlessly resumes upon the visitor's first user interaction (`pointerdown`, `keydown`, `touchstart`).

### 6. Custom Cursor & Responsive UI
- **Dual-Element Custom Cursor**: Outer trailing ring (`.cursor-ring`) with exponential easing physics and inner precision dot (`.cursor-dot`).
- **Hover Micro-Interactions**: Dynamically expands and shifts color when hovering over interactive cards, buttons, or navigation anchors.
- **Fully Responsive Layout**: Built with CSS clamp values, mobile-optimized typography, and automatic WebGL canvas resizing across mobile, tablet, and desktop displays.

---

## 💻 Featured Projects in the Portfolio

The interactive book viewer features detailed information and snapshots for Sandeep's key projects:

| # | Project | Description | Tech Stack |
|---|---|---|---|
| **01** | **StudentOS** | Comprehensive student productivity ecosystem integrating expense tracking, smart timetable planning, and career roadmap generation. | `Python` · `Streamlit` · `Pandas` · `SQLite` |
| **02** | **AWS Two-Tier Web Application** | Robust cloud-hosted web application deployed across isolated public and private subnets inside a custom Amazon VPC. | `AWS` · `EC2` · `VPC` · `PHP` · `MySQL` · `Linux` |
| **03** | **Static Website on AWS S3** | Production-ready static site deployment utilizing Amazon S3 object storage and public web hosting configurations. | `AWS S3` · `HTML5` · `CSS3` · `GitHub` |

---

## 🛠️ Technologies Used

### Frontend & 3D Graphics
- **[Three.js](https://threejs.org/) (`^0.187.0`)**: 3D scene graph, perspective camera, `WebGLRenderer`, directional & point lights, particle systems, shadow mapping, and `GLTFLoader`.
- **[Vite](https://vitejs.dev/) (`^8.3.5`)**: High-performance frontend build tool providing lightning-fast HMR and optimized production bundling.
- **JavaScript (ES6+ Modules)**: Component architecture, mathematical spline calculations, audio state machine, and pointer event handling.
- **HTML5 & CSS3**: Semantic markup, custom properties (CSS variables), CSS 3D transforms (`rotateY`, `translateZ`, `perspective`), CSS Grid, and Flexbox.

### Fonts & Design Systems
- **DM Mono**: Clean, technical monospaced font for badges, data points, and code aesthetics.
- **Manrope**: Modern geometric sans-serif for UI typography.
- **Georgia**: Classic serif styling applied to book leaves for an authentic editorial feel.

---

## 📁 Project Structure

```text
Sandeep-3D-Portfolio/
├── public/
│   ├── audio/
│   │   ├── birds.mp3              # Periodic forest bird ambience
│   │   ├── forest-music.mp3       # Atmospheric background melody
│   │   ├── rain.mp3               # Looping ambient rainfall sound
│   │   └── thunder.mp3            # Positional thunder sound effect
│   ├── files/
│   │   └── Sandeep_Goda_Resume.pdf# Downloadable and viewable resume PDF
│   ├── image/
│   │   ├── certificates/          # 8 achievement certificate images
│   │   │   ├── certificate_1.jpeg
│   │   │   └── ...
│   │   ├── projects/              # Project demonstration screenshots
│   │   │   ├── aws_1.png
│   │   │   ├── aws_2.png
│   │   │   ├── s3_1.png
│   │   │   ├── s3_2.png
│   │   │   ├── studentos_1.png
│   │   │   └── studentos_2.png
│   │   └── sandeep-profile.jpeg   # Profile photograph
│   ├── models/                    # 3D GLTF / GLB assets
│   │   ├── cabin.glb              # Main wooden cabin mesh
│   │   ├── cabin-new.glb          # Alternative cabin asset
│   │   ├── dirt-ground.glb        # Ground terrain asset
│   │   ├── forest-ground.glb      # Surrounding terrain asset
│   │   ├── grass.glb              # Clustered grass foliage
│   │   ├── lamp.glb               # Rustic outdoor lantern post
│   │   ├── pine.glb               # Individual pine tree
│   │   ├── pine-trio.glb          # Clustered pine tree trio
│   │   ├── rocks.glb              # Scattered natural rocks
│   │   └── stairs.glb             # Wooden cabin entry steps
│   ├── favicon.svg                # Browser favicon
│   └── icons.svg                  # SVG icon set
├── src/
│   ├── assets/                    # Static branding & development assets
│   ├── book-viewer.css            # Styles for 3D book modal & page-turns
│   ├── book-viewer.js             # 3D book interaction & modal controller
│   ├── counter.js                 # Helper utility module
│   ├── main.js                    # Core Three.js scene, camera & loop
│   └── style.css                  # Global styles, UI overlay & cursor
├── .gitignore                     # Git ignore configuration
├── index.html                     # Application HTML entry point
├── package-lock.json              # Dependency lockfile
├── package.json                   # Project scripts and dependencies
└── README.md                      # Project documentation
```

---

## 📸 Screenshots

<!-- Replace these placeholder blocks with your actual project screenshots or demo recordings -->

| 3D Forest & Cabin Scene | Interactive 3D Book Viewer |
| :---: | :---: |
| *Placeholder: Screenshot of the moonlit 3D cabin and pine forest* | *Placeholder: Screenshot of the open 3D project book spread* |

| Dynamic Lightning Effect | Certificates & Learning Journal |
| :---: | :---: |
| *Placeholder: Screenshot of lightning illumination in the forest* | *Placeholder: Screenshot of the dual-page certificate viewer* |

> 💡 **Tip for capturing screenshots**: Run the project locally (`npm run dev`), maximize your browser window (`F11`), and capture high-resolution captures of the 3D scene, weather effects, and open book spreads to showcase here.

---

## 🚀 Installation and Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system (version 18.0 or higher is recommended).

### 1. Clone the Repository
```bash
git clone https://github.com/sandeep-9553/Sandeep-3D-Portfolio.git
cd Sandeep-3D-Portfolio
```

### 2. Install Dependencies
Install the required packages using `npm`:
```bash
npm install
```

### 3. Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```

Open your browser and navigate to the local URL shown in your terminal (typically `http://localhost:5173/`).

### 4. Build for Production
To generate an optimized production build:
```bash
npm run build
```
The compiled files will be output to the `dist/` directory.

### 5. Preview Production Build
To preview the production build locally before deployment:
```bash
npm run preview
```

---

## 🌐 Live Demo

> **Live Deployment**: *Placeholder — A live deployment link will be provided here upon hosting.*
>
> *(e.g., Vercel, Netlify, GitHub Pages, or AWS S3)*

---

## 👨‍💻 Author & Contact

**Sandeep Goda**  
*Computer Science & Data Science Student · Developer · Cloud Enthusiast*

- **GitHub**: [github.com/sandeep-9553](https://github.com/sandeep-9553)
- **LinkedIn**: [linkedin.com/in/sandeep-goda-692154329](https://www.linkedin.com/in/sandeep-goda-692154329/)
- **Email**: [sgoda8101@gmail.com](mailto:sgoda8101@gmail.com)

---

## 📄 License

No license has been specified for this project. All rights are reserved by the author, Sandeep Goda.
