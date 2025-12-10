# 3D Lip-Sync Demo

Interactive 3D characters that talk with lipsync movements.

**Live:** https://appviewerv1.web.app

---

## What this is

An extra demo I built after finishing the main assessment to show I can work with 3D graphics too. It's a web app with photorealistic characters (Aima and Sara) that chat using AI and move their lips in sync with the audio.

Built with React Three Fiber, OpenAI for the chat/voice, and a custom lip-sync library. Deployed on Firebase.

### Why make this?

The main take-home was a React Native mobile app. I finished that and had some time left, so I wanted to demonstrate:
- WebGL/Three.js skills
- Character animation systems
- Modern React patterns (hooks, Zustand)
- Deployment know-how

Plus it's just cool seeing a 3D character respond to you in real-time.

---

## Features

- Two photorealistic 3D characters
- AI conversation (OpenAI GPT)
- Text-to-speech with lip sync
- Character switching
- Settings panel for customization
- Smooth animations and post-processing effects

---

## Quick Start

```bash
npm install
npm run dev
```

Opens on http://localhost:5173

To build:
```bash
npm run build
```

Output goes to `dist/` folder.

---

## Tech Stack

- React 19
- Three.js for 3D rendering
- React Three Fiber (React wrapper for Three.js)
- Vite for build tooling
- Tailwind CSS for styling
- OpenAI API for chat and TTS
- Zustand for state
- IndexedDB for caching audio

Nothing groundbreaking, just solid modern web stack.

---

## How it Works

**Loading:**
1. Loads the 3D model (GLB file ~5MB)
2. Caches intro audio in IndexedDB
3. Shows loading progress 0-100%

**Chat:**
1. User types message
2. Sends to OpenAI GPT
3. Gets response text
4. Converts to speech (OpenAI TTS)
5. Plays audio while animating lip movements

**Lip Sync:**
Uses morph targets on the 3D model. The wawa-lipsync library analyzes the audio and calculates which mouth shapes to use frame by frame. Pretty neat.

---

## File Structure

```
src/
├── components/
│   ├── Avatar.jsx          # 3D character
│   ├── Experience.jsx      # Scene setup
│   ├── UI.jsx              # Chat interface
│   ├── SettingsPanel.jsx   # Controls
│   └── ...
├── hooks/
│   └── useChat.jsx         # AI chat logic
├── App.jsx
└── index.css

public/
├── models/
│   ├── 65c1b22c3c37de31c1741930.glb  # Aima
│   └── ManCharacter.glb              # Sara
└── audios/
    └── intro.mp3
```

Pretty straightforward. Components for rendering, hooks for logic, public folder for assets.

---

## Characters

### Aima (Female)
- ~50K polygons
- 4K textures
- 52 facial morph targets

### Sara (Male)  
- ~45K polygons
- 2K textures
- 52 facial morph targets

Both use ARKit-style blendshapes which is the standard for facial animation. Works well with the lip-sync algorithm.

---

## Deployment

Currently on Firebase Hosting. Takes like 5 minutes to deploy:

```bash
npm run build
firebase deploy --only hosting
```

Could also deploy to Vercel, Netlify, or any static host. It's just a SPA.

---

## Limitations

- Performance isn't optimized for mobile (loads fine but FPS can drop)
- No accessibility features
- Error handling is basic
- Models are pretty heavy (could use LOD)

This was built in about 4 hours as a bonus demo. It works well but isn't production-polished.

---

## Customization

Want to add your own character?

1. Export a GLB model with ARKit blendshapes
2. Drop it in `/public/models/`
3. Add it to the character list in `SettingsPanel.jsx`
4. Update the mapping in `Avatar.jsx`

Done.

---

## What this proved

That I can:
- Work across different tech stacks (React Native → Three.js)
- Ship something live (Firebase deploy)
- Integrate AI services in different contexts
- Build interactive 3D experiences
- Write clean component architecture

Not bad for a few hours of extra work.

---

**License:** MIT  
**Status:** Deployed and working  
**Time to build:** ~4 hours
