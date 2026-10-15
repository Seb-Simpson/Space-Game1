export class AudioSystem {
  private context?: AudioContext;
  enabled = false;
  async toggle() { this.enabled = !this.enabled; if (this.enabled) { this.context ??= new AudioContext(); await this.context.resume(); this.cue(); } }
  cue() { if (!this.enabled || !this.context) return; const oscillator = this.context.createOscillator(); const gain = this.context.createGain(); oscillator.frequency.value = 520; gain.gain.setValueAtTime(0.035, this.context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.14); oscillator.connect(gain).connect(this.context.destination); oscillator.start(); oscillator.stop(this.context.currentTime + 0.15); }
}
