import { CONFIG } from './config';
export class GameLoop {
  private frame = 0; private previous = 0; private accumulator = 0;
  constructor(private update: (dt: number) => void, private render: (alpha: number) => void) {}
  start() { this.previous = performance.now(); this.frame = requestAnimationFrame(this.tick); }
  stop() { cancelAnimationFrame(this.frame); }
  private tick = (now: number) => {
    this.accumulator += Math.min((now - this.previous) / 1000, CONFIG.maxFrame); this.previous = now;
    let steps = 0;
    while (this.accumulator >= CONFIG.step && steps++ < CONFIG.maxSteps) { this.update(CONFIG.step); this.accumulator -= CONFIG.step; }
    this.render(this.accumulator / CONFIG.step); this.frame = requestAnimationFrame(this.tick);
  };
}
