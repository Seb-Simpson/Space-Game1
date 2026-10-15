export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
