# Cinnamoroll 3D Viewer

An interactive 3D Cinnamoroll viewer built with Three.js, featuring webcam-based hand tracking, a dreamy cloud-themed interface, and day and night modes.

## Overview

Cinnamoroll 3D Viewer is a browser-based project that combines 3D rendering with hand-tracking technology. Users can rotate the character with mouse or touch input, use webcam-based hand movement to control rotation and zoom, and switch between day and night themes.
![Cinnamoroll 3D Viewer](screenshots/Screenshot%202026-10-25%20222147.png)

![Cinnamoroll 3D Viewer, night view](screenshots/Screenshot%202026-10-25%20222206.png)
## Features

- Interactive 3D Cinnamoroll model
- Drag-to-rotate controls
- Buttons to rotate and reset the view
- Webcam-based hand tracking with MediaPipe
- Hand movement controls for rotation and zoom
- Day and night theme toggle
- Animated clouds, stars, hearts, and glowing effects
- Responsive, cloud-themed interface

## Tech Stack

- **JavaScript** — Application logic
- **Three.js** — 3D rendering
- **MediaPipe Tasks Vision** — Hand tracking
- **Vite** — Development server and build tool
- **HTML and CSS** — Page structure and styling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- A modern browser with WebGL support
- A webcam for hand-tracking controls

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/dhritiiixpaw/cinnamoroll-3d-viewer.git
cd cinnamoroll-3d-viewer
npm install
```

### Run Locally

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Using Hand Tracking

1. Open the application in a supported browser.
2. Select **Start Hand Tracking**.
3. Allow camera access when prompted.
4. Move your hand horizontally to rotate the model.
5. Move your hand closer to or farther from the camera to control zoom.
6. Select **Stop Hand Tracking** when finished.

Camera access generally requires a secure context, such as HTTPS or localhost.

## Project Structure

```text
cinnamoroll-3d-viewer/
├── public/
├── src/
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── .gitignore
```

The 3D model is loaded from `public/models/cinnamorroll.glb`.

## Author

**Dhritileena Roy**

- [GitHub Profile](https://github.com/dhritiiixpaw)
- [Project Repository](https://github.com/dhritiiixpaw/cinnamoroll-3d-viewer)
- [Portfolio — My Little Corner](https://dhritiiixpaw.github.io/my-little-corner/)
