export class InputController {
  private keys = new Set<string>();
  private abort = new AbortController();
  constructor(private action: (action: 'launch' | 'pause') => void) {
    window.addEventListener('keydown', e => {
      if (!e.repeat && e.code === 'Escape') { action('pause'); return; }
      if ((e.target as HTMLElement).matches('input,select,textarea')) return;
      if (e.code === 'Space' && (e.target as HTMLElement).matches('button')) return;
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (!e.repeat && e.code === 'Space') action('launch');
    }, { signal: this.abort.signal });
    window.addEventListener('keyup', e => this.keys.delete(e.code), { signal: this.abort.signal });
    window.addEventListener('blur', () => { this.keys.clear(); this.action('pause'); }, { signal: this.abort.signal });
  }
  get steering() { return Number(this.keys.has('ArrowRight') || this.keys.has('KeyD')) - Number(this.keys.has('ArrowLeft') || this.keys.has('KeyA')); }
  get throttle() { return Number(this.keys.has('ArrowUp') || this.keys.has('KeyW')) - Number(this.keys.has('ArrowDown') || this.keys.has('KeyS')); }
  destroy() { this.abort.abort(); }
}
