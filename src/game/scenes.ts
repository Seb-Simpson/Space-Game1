import type { Scene } from './state';
export class SceneManager {
  current: Scene = 'menu';
  constructor(private onChange: (scene: Scene) => void) {}
  enter(scene: Scene) { this.current = scene; this.onChange(scene); }
}
