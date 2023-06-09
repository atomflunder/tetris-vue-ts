/**
 * The possible Menu Options.
 */
export enum Menu {
    None,
    Config,
    Control,
    Stats,
    Endless,
    Marathon,
    Sprint,
    Time
}

/**
 * The possible T-Spin outcomes.
 */
export enum TSpin {
    None,
    Mini,
    Full
}

/**
 * The last successful move a player makes.
 */
export enum Move {
    None,
    Drop,
    Rotation,
    Left,
    Right
}

/**
 * The Direction of a move in game.
 */
export enum Direction {
    // You cannot really ever move a piece up in tetris.
    Down,
    Left,
    Right
}

/**
 * A repeated keypress, used to mimic DAS.
 * Only in use for ArrowLeft, ArrowRight and ArrowDown.
 */
export interface KeyEvents {
    [id: string]: NodeJS.Timeout | null;
}

export interface SoundFiles {
    [key: string]: HTMLAudioElement;
}
