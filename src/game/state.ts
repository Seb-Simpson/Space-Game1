export type Scene = 'menu' | 'flight' | 'paused';
export interface FlightState { altitude: number; velocity: number; downrange: number; horizontalVelocity: number; angle: number; throttle: number; fuel: number; time: number; launched: boolean; status: 'standby' | 'flying' | 'landed' | 'crashed' }
export const createFlight = (): FlightState => ({ altitude: 0, velocity: 0, downrange: 0, horizontalVelocity: 0, angle: 0, throttle: 0, fuel: 16000, time: 0, launched: false, status: 'standby' });
