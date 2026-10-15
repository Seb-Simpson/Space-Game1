import { CONFIG } from '../core/config';
import type { FlightState } from '../game/state';
import { createFlight } from '../game/state';
export class SaveStore {
  save(state: FlightState): boolean { try { localStorage.setItem(CONFIG.saveKey, JSON.stringify({ version: CONFIG.version, state })); return true; } catch { return false; } }
  load(): FlightState | null {
    try {
      const data = JSON.parse(localStorage.getItem(CONFIG.saveKey) ?? 'null');
      if (data?.version !== CONFIG.version || !data.state) return null;
      const s = data.state;
      for (const [key, value] of Object.entries(createFlight())) {
        if (typeof s[key] !== typeof value || (typeof value === 'number' && !Number.isFinite(s[key]))) return null;
      }
      if (s.altitude < 0 || s.fuel < 0 || s.fuel > 16000 || s.throttle < 0 || s.throttle > 1 || s.time < 0 || Math.abs(s.angle) > Math.PI / 2 || !['standby','flying','landed','crashed'].includes(s.status)) return null;
      return { ...createFlight(), ...s };
    } catch { return null; }
  }
}
