
export const WIDTH = 1000;
export const HEIGHT = 620;
export const ABDUCTION_RADIUS = 2.5;
export const PLAYER_SPEED = 0.2;
export const PLAYER_ABDUCTION_SPEED = 0.2;
export const ITEM_ABDUCTION_SPEED = 0.4;
export const ABDUCTION_HEIGHT = 7;
export const TURNING_POWER = {
    start: 0.04,
    end: 0.2,
    halfLifeSeconds: 60
} as const;
export const UFO_SPEED_MULT = {
    start: 0.95,
    end: 0.95 + 0.18,
    halfLifeSeconds: 15
} as const;
export const ITEM_DELAY_MULT = {
    start: 1,
    end: 0.5,
    halfLifeSeconds: 60
} as const;

export const INTRO_TEXT = `<p><u>You were the chosen one</u> by the aliens, and now you must avoid being abducted by their UFO at all costs</p>
<p>Controls: WASD or Arrow keys</p>
<p>Made for the TriJam game jam #383</p>
<button onclick='play()'>Play</button>`