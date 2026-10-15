import type { FlightState } from '../game/state';
import { EARTH } from '../celestial/bodies';
import { PATHFINDER } from '../builder/vehicle';
import { clamp } from '../utils/math';
export function stepFlight(state: FlightState, dt: number, steering: number) {
  if (!state.launched || state.status !== 'flying') return;
  state.time += dt;
  state.angle = clamp(state.angle + steering * dt * 0.6, -Math.PI / 2, Math.PI / 2);
  const burn = Math.min(state.fuel, PATHFINDER.burnRate * state.throttle * dt);
  const power = burn / (PATHFINDER.burnRate * dt);
  const acceleration = PATHFINDER.thrust * power / (PATHFINDER.dryMass + state.fuel);
  state.fuel -= burn;
  const gravity = EARTH.gravity * (EARTH.radius / (EARTH.radius + state.altitude)) ** 2;
  const drag = Math.exp(-state.altitude / 8500) * 0.00002;
  state.velocity += (acceleration * Math.cos(state.angle) - gravity - drag * state.velocity * Math.abs(state.velocity)) * dt;
  state.horizontalVelocity += (acceleration * Math.sin(state.angle) - drag * state.horizontalVelocity * Math.abs(state.horizontalVelocity)) * dt;
  state.altitude += state.velocity * dt;
  state.downrange += state.horizontalVelocity * dt;
  if (state.altitude < 0) { state.altitude = 0; state.status = Math.abs(state.velocity) < 6 ? 'landed' : 'crashed'; state.velocity = 0; state.throttle = 0; }
}
