/* tslint:disable:no-magic-numbers */
export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
export const GRID_WIDTH: number = 10;
export const PI_OVER_2: number = Math.PI / 2;
export const PI_OVER_4: number = Math.PI / 4;
export const HALF: number = 0.5;
export const COMPLEMENT_PI_OVER_4: number = Math.PI - PI_OVER_4;
export const BLACK_CHAR: string = "*";
export const INITIAL_CAMERA_POSITION_Y: number = 25;
export const FRUSTUM_RATIO: number = 100;
export const NO_CHEAT_COLOR: string = "#7BABEF";
export const CHEAT_COLOR: string = "#FF3E04";
export const COLLISION_SOUND_NAME: string = "collisionSound.ogg";
export const ENGINE_SOUND_NAME: string = "engineSound.wav";
export const WALL_SOUND_NAME: string = "wallSound.ogg";

// Edit track
export const DEFAULT_LINE_WIDTH: number = 5;
export const TRACK_WIDTH: number = 20;
export const MINIMUM_TRACK_LENGTH: number = TRACK_WIDTH * 3;
export const DEFAULT_CIRCLE_RADIUS: number = 10;
export const TWICE_DEFAULT_CIRCLE_RADIUS: number = DEFAULT_CIRCLE_RADIUS * 2;
export const FULL_CIRCLE_RAD: number = Math.PI * 2;
export const NO_SELECTED_POINT: number = -1;
export const RIGHT_MOUSE_BUTTON: number = 2;
export const PRECISION_PIXELS: number = 1;
export const SKIP_SEGMENT: number = 2;
export const POINT_BY_LETTER: number = 10;
export const LAP_NUMBER: number = 3;
export const ROAD_WIDTH: number = 20;

export enum DifficultyView {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard"
}

export const WINNER_TITLE: string = "Congratulations!";
export const LOSER_TITLE: string = "Too bad, you lost...";
export const TIE_TITLE: string = "It's a tie!";
