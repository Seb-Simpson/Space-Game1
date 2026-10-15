import { Assets } from 'pixi.js';
export const assetManifest: { alias: string; src: string }[] = [];
// Add versioned, same-origin assets here. Procedural flight visuals require no downloads.
export async function loadAssets(progress: (value: number) => void) {
  if (!assetManifest.length) { progress(1); return; }
  await Assets.load(assetManifest, progress);
}
