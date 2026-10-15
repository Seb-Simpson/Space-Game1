import { EARTH } from '../celestial/bodies';
export const estimateApogee = (altitude: number, verticalVelocity: number) => altitude + Math.max(0, verticalVelocity) ** 2 / (2 * EARTH.gravity);
