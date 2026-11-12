/**
 * ui-preview.ts — the UI preview (ui-preview.html): menu screens and the in-game HUD over a CSS backdrop, no WebGL.
 * Lets the localized interface be checked without a GPU. ?state=menu|skirmish|settings|help|pause|hud|gameover (&lang=en|ko).
 * The game world is the real headless sim; the camera / scene are plain three.js objects that never render.
 */
import './i18n-catalog';
import * as THREE from 'three';
import './ui/theme.css';
import { World } from './sim/world-state';
import { appState } from './ui/app-state';
import { GameUi } from './ui/game-ui';
import { Menu } from './ui/menu';
import { applyUiScale } from './ui/settings';
import { GameOverScreen } from './ui/game-over';

applyUiScale();
const state = new URLSearchParams(location.search).get('state') ?? 'menu';
const world = new World();
world.reset(7);

const menu = new Menu();
menu.onCampaign = () => {};
menu.onLevels = () => {};
menu.onEditor = () => {};
menu.onResume = () => {};
menu.onRestart = () => {};
menu.onQuit = () => {};

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
const target = new THREE.Vector3(world.tribes.player?.home.x ?? 20, 0, world.tribes.player?.home.z ?? 20);
camera.position.set(target.x + 20, 25, target.z + 20);
camera.lookAt(target);
let ui: GameUi | null = null;

if (state === 'hud' || state === 'gameover') {
  menu.hide();
  appState.mode = 'game';
  const canvas = document.createElement('canvas');
  ui = new GameUi(world, { camera, target: { x: target.x, z: target.z } as never, map: world.map }, new THREE.Scene(), canvas, { fps: 60, tickCount: 0 }, {
    openMenu: () => {}, openHelp: () => {}, restart: () => {}, quitToMenu: () => {}, isBlocked: () => false,
  }, () => 3);
  ui.reset();
  for (let i = 0; i < 15 * 20; i++) world.tick(1 / 15);
  const loop = () => {
    ui!.update(1 / 60);
    requestAnimationFrame(loop);
  };
  loop();
  if (state === 'gameover') {
    new GameOverScreen({ onRestart: () => {}, onMenu: () => {} }).show('victory', null, { seconds: 754, peakPopulation: 42, spellsCast: 17, buildings: 9 });
  }
} else if (state === 'skirmish' || state === 'settings' || state === 'help') {
  menu.show(state);
} else if (state === 'pause') {
  menu.openInGame('pause');
} else {
  menu.show('title');
}
(window as unknown as { __ui: unknown }).__ui = { menu, world, ui };
