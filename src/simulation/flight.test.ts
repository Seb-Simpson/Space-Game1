import { describe, expect, it } from 'vitest';
import { createFlight } from '../game/state';
import { stepFlight } from './flight';
import { estimateApogee } from '../map/orbit';
describe('flight simulation', () => {
 it('keeps a standby vehicle on the pad', () => { const s=createFlight(); stepFlight(s,1/60,1); expect(s).toEqual(createFlight()); });
 it('burns fuel and lifts off at full thrust', () => { const s=createFlight(); s.launched=true;s.status='flying';s.throttle=1; for(let i=0;i<600;i++) stepFlight(s,1/60,0); expect(s.altitude).toBeGreaterThan(500);expect(s.fuel).toBeCloseTo(14700);expect(s.time).toBeCloseTo(10); });
 it('stops at the surface and classifies a hard landing', () => { const s=createFlight(); Object.assign(s,{launched:true,status:'flying',altitude:1,velocity:-20}); stepFlight(s,0.1,0);expect(s.status).toBe('crashed');expect(s.altitude).toBe(0); });
 it('never consumes negative fuel and clamps pitch', () => {const s=createFlight();Object.assign(s,{launched:true,status:'flying',altitude:10000,fuel:1,throttle:1});for(let i=0;i<300;i++)stepFlight(s,1/60,1);expect(s.fuel).toBe(0);expect(s.angle).toBeLessThanOrEqual(Math.PI/2);});
 it('estimates no extra apogee when descending',()=>expect(estimateApogee(200,-10)).toBe(200));
});
