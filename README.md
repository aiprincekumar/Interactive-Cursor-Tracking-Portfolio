# 🦋 Atul Verma • Interactive Cursor-Tracking Portfolio

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-22c55e?logo=github&logoColor=white)](https://pages.github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cinematic, high-performance professional portfolio featuring a **full-width 2.5D interactive camera character**, realistic **butterfly cursor tracking** with GPU-accelerated stardust particle physics, and responsive editorial sections showcasing **Atul Verma** — **Accountant & Tax Consultant • Business Development & Office Administrator** located in **Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India**.

---

## ✨ Features & Architecture

### 1. 📸 Full-Width 2.5D Character Hero Section
- **100% Viewport Immersion (`w-full` & `100vh`)**: Edge-to-edge full-bleed hero presentation with zero restrictive container borders.
- **Continuous 2.5D Gaze & Head Tracking**: Frame-rate independent requestAnimationFrame loop (60–120 FPS) calculating yaw/pitch perspective transforms with smooth cubic Hermite crossfading across Center, Left, and Right camera poses.
- **Viewfinder & Focus Reticle**: 4-corner cinematic brackets `[ 🦋 ]` and a micro focus reticle that tracks cursor movement.
- **Interactive Shutter Capture**: Clicking anywhere triggers an authentic camera flash, synthesized audio shutter feedback, and instant polaroid snapshot capture.

### 2. 🦋 Full-Page Realistic Butterfly Cursor Simulation
- **Global Page Coverage**: Active across all sections from header to footer with permanent opacity and dynamic heading orientation via `atan2`.
- **Aerodynamic Banking & Flutter**: 3D roll proportional to turn rate; adaptive wing flap frequency (fast flight flap vs gentle hover drift).
- **Additive Stardust Particle Canvas**: High-speed, GPU-composited 2D canvas emitter generating shimmering stardust trails and click burst explosions without layout thrashing.

### 3. 🎗️ Intersecting Diagonal Marquee Ribbons
- Dual crossed ribbon banners with watercolor butterfly delimiters (`🦋`):
  - **Upper ribbon (-3.5°)**: Charcoal `#18181B` (`Tally Prime 🦋 GST Portal 🦋 Income Tax E-Filing 🦋 MS Excel (Advanced) 🦋 Path Solution ERP 🦋 ADCA Infocity`)
  - **Lower ribbon (+2.8°)**: Hot Pink `#FF4D6D` (`Tax Advisory & Filing 🦋 Financial Accounting 🦋 GST Compliance & ITC 🦋 MIS Executive Analytics 🦋 Smart Card Operations 🦋 Business Development`)

### 4. 📖 "Who I am" Editorial Bio
- Minimalist ivory layout (`#FAF8F5`) highlighting location (*Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India*), education (*ADCA & Intermediate (I.A.)*), and professional focus badges.

### 5. ⚡ "What I work with" Skills Matrix
- Interactive categorized pills (Accounting & Tax, Software & Applications, Core Operations, Technical Skills) paired with a live dark charcoal `#18181B` inspector terminal that displays proficiency meters, years of experience, and operational details.

### 6. 💼 "Selected Work" Deep Dives
- **01 GST & Income Tax Compliance Engine**: Statutory tax reconciliation system with live ITC Section 16(2) compliance audit simulation, Form 26AS/AIS verification, and TDS withholding checks.
- **02 DAY-NULM Skill India MIS Reporting Portal**: Centralized MIS candidate lifecycle management and batch certification tracking system (50+ batches, 2,500+ trainees, 99.8% reporting accuracy).
- **03 Multi-District Smart Card Operations & Enrollment Engine**: Large-scale citizen identity verification and biometric enrolment logistics pipeline across 4 districts in Bihar & Jharkhand.

### 7. 🏆 Professional Milestones & Operations Record
- Deep aubergine dark section (`#1A1625`) featuring a running operational ticker (`4+ Years Tally Accounting 🦋 3+ Years GST & Tax Filing 🦋 4 Districts Smart Card Rollout 🦋 ADCA Certified 🦋 500+ Tax Returns Processed`) and verified milestone metric cards.

### 8. 🎞️ Interactive Polaroid Studio & Physics Tuner
- Tiltable polaroid cards storing captured photos with like counters and high-res modal zoom.
- Real-time physics lab controls to adjust butterfly velocity, trail density, and scale in real time.

### 9. 📬 Contact & Dark Plum Watermark Footer
- High-impact editorial display typography (*"Let's build something meaningful."*) with a giant hot pink email pill button (`Atulravi2015@gmail.com ↗`) and location details.
- Footer with giant faint watermark typography (`ATUL VERMA`).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or pnpm / bun

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```
The optimized bundle will be created inside the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

This project is pre-configured for seamless GitHub Pages deployment using **relative base paths (`base: './'`)**. You can deploy it using either of the following two methods:

### Method 1: Automatic Deployment via GitHub Actions (Recommended ⭐)

1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub, navigate to your repository:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, select **GitHub Actions**
3. That's it! The included [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) workflow will automatically build and deploy your site on every push to `main`.
4. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`!

---

### Method 2: Manual CLI Deployment via `gh-pages`

1. Set your remote origin if not already set:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   ```
2. Run the deploy script:
   ```bash
   npm run deploy
   ```
   This command automatically builds the project (`npm run build`) and pushes the `dist` folder to the `gh-pages` branch.
3. On GitHub, go to **Settings** > **Pages**:
   - Under **Source**, select **Deploy from a branch**
   - Choose the `gh-pages` branch and `/ (root)` folder
   - Click **Save**

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── assets/                   # High-resolution character poses (940x1240)
│   │   ├── character-center.jpg  # Smiling center pose
│   │   ├── character-left.jpg    # Camera aiming left pose
│   │   └── character-right.jpg   # Camera aiming right pose
│   ├── favicon.svg               # SVG Butterfly favicon
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AboutSection.jsx      # "Who I am" bio & education
│   │   ├── ButterflyCursor.jsx   # 120 FPS butterfly cursor & canvas stardust
│   │   ├── CameraRollGallery.jsx # Polaroid photo gallery
│   │   ├── CodingAchievementsSection.jsx # CP stats & platform marquee
│   │   ├── ContactSection.jsx    # Contact CTA & quick message form
│   │   ├── Footer.jsx            # Dark plum watermark footer
│   │   ├── HeroSection.jsx       # Full-width 2.5D camera character hero
│   │   ├── Icons.jsx             # SVG icons (GitHub, LinkedIn, Notion, etc.)
│   │   ├── InteractivePlayground.jsx # Real-time cursor & physics lab
│   │   ├── Navbar.jsx            # Floating pill navigation
│   │   ├── ProjectsSection.jsx   # PolicyGuard AI & Payment Gateway state machine
│   │   ├── SkillsSection.jsx     # Skills pills & dynamic dark inspector
│   │   └── TechMarqueeBanner.jsx # Diagonal crossed marquee ribbons
│   ├── utils/
│   │   └── audio.js              # Synthesized Web Audio API sound effects
│   ├── App.jsx                   # Main layout container & state coordinator
│   ├── index.css                 # Tailwind CSS v4 directives & font imports
│   └── main.jsx                  # React application root
├── .gitignore                    # Clean Git ignore rules
├── index.html                    # HTML shell with meta tags & relative assets
├── package.json                  # Scripts & dependencies (including gh-pages)
├── README.md                     # Documentation & deployment guide
└── vite.config.js                # Vite config with base: './' for GitHub Pages
```

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Synthesis**: Native Web Audio API (zero external audio file dependencies)
- **Deployment**: [GitHub Pages](https://pages.github.com/) & [GitHub Actions](https://github.com/features/actions)

---

## 📜 Credits & Attribution

- **Concept & Design**: Inspired by the viral cursor-tracking showcase aesthetic.
- **Portfolio Identity**: Atul Verma (Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India).
- **Role**: Accountant & Tax Consultant • Business Development & Office Administrator.
