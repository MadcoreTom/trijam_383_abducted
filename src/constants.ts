
export const WIDTH = 1000;
export const HEIGHT = 620;
export const ABDUCTION_RADIUS = 2.5;
export const PLAYER_SPEED = 0.2;
export const PLAYER_ABDUCTION_SPEED = 0.2;
export const ITEM_ABDUCTION_SPEED = 0.4;
export const ABDUCTION_HEIGHT = 7;
export const TURNING_POWER = {
    start: 0.04,
    end: 0.14,
    halfLifeSeconds: 45
} as const;
export const UFO_SPEED_MULT = {
    start: 0.95,
    end: 0.95 + 0.18,
    halfLifeSeconds: 10
} as const;