import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// The game ships as a static site to GitHub Pages at
// https://br3nt.github.io/tribal-gods/ — a *project* page, so every asset
// URL must be prefixed with the repo name or the browser 404s them off the
// domain root. `base` does exactly that at build time. For local `npm run
// dev` Vite ignores base, so development is unaffected.
//
// manualChunks: three.js is most of the bytes and changes far less often
// than the game, so it ships as its own chunk (cached across releases), and
// the game splits along its own seams: the headless sim + content, the
// renderer + procedural models, and the rest (UI, world, boot). Behaviour is
// unchanged — the same modules, loaded up front, just in separate files.
export default defineConfig({
  base: '/tribal-gods-ko/',
  // ui-preview.html (the menus and HUD over a CSS backdrop, no WebGL) ships too: it lets the Korean UI be checked without a GPU.
  build: {
    rollupOptions: {
      input: { main: resolve(import.meta.dirname, 'index.html'), uipreview: resolve(import.meta.dirname, 'ui-preview.html') },
      output: {
        // lowercase hex hashes only: the repo is also published from docs/ through the GitHub web uploader, which lowercases file names.
        hashCharacters: 'hex',
        manualChunks(id) {
          // three ships as two modules (core math/scene graph, and the WebGL
          // renderer on top) plus the example add-ons we use for post
          // effects: three chunks, each under the 500 kB warning.
          if (id.includes('node_modules/three/build/three.core')) return 'three-core';
          if (id.includes('node_modules/three/examples')) return 'three-addons';
          if (id.includes('node_modules/three')) return 'three';
          return undefined;
        },
      },
    },
  },
});
