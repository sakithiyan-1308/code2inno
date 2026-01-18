# Project Technical Specifications

## 1. Project Overview
*   **Project Name:** `cyberpunk-city-portfolio`
*   **Type:** Single Page Application (SPA)
*   **Domain:** 3D Graphics / Interactive Web
*   **Framework:** React 18

## 2. Technology Stack
### Core
*   **Runtime:** Node.js (Development)
*   **Build Tool:** Vite (v5.0.10)
*   **Frontend Framework:** React (v18.2.0)
*   **Language:** JavaScript (ES Modules)

### Graphics & 3D
*   **Core Engine:** Three.js (v0.160.0)
*   **React Bindings:** @react-three/fiber (v8.16.8)
*   **Helpers/Abstractions:** @react-three/drei (v9.108.0)

### Utilities
*   **State Management:** Zustand
*   **GUI Controls:** Leva

## 3. Asset & File Size Analysis
**Warning:** This project contains significant asset files which may impact hosting costs (bandwidth) and load times.

### Key Assets (Root Directory)
| File Name | Size | Type | Notes |
|-----------|------|------|-------|
| `golden_horizon___sunrise_sky_environment.glb` | **~120.7 MB** | 3D Model | ⚠️ **Very Large**. Highly recommended to compress or optimize for web. |
| `spaceship_clst_500.glb` | **~34.8 MB** | 3D Model | Large. Consider optimization. |
| `hologram.glb` | ~10.4 MB | 3D Model | |
| `scene.bin` | ~4.4 MB | Binary Data | |
| `scene.gltf` | ~50 KB | 3D Scene | |

### Source Code
*   **Source Location:** `src/`
*   **Entry Point:** `index.html` (Vite pattern)

## 4. Hosting Considerations
### Build Format
*   **Output Directory:** `dist/` (Created after running build)
*   **Content:** Static Files (HTML, CSS, JS, Assets)
*   **Routing:** Client-Side Routing. Ensure host redirects all 404s to `index.html` (Rewrite rules).

### Bandwidth & Performance
Due to the ~160MB+ of total assets, verify that your hosting provider can support this bandwidth.
*   **Recommended actions:**
    *   Compress `.glb` files (using tools like gltf-transform or online compressors).
    *   Ensure the host supports HTTP/2 or HTTP/3.
    *   Use a CDN (Cloudflare, Vercel Edge, Netlify Edge) if possible.

## 5. Development & Build Commands
*   **Install Dependencies:** `npm install`
*   **Start Local Dev Server:** `npm run dev`
*   **Build for Production:** `npm run build`
*   **Preview Production Build:** `npm run preview`
