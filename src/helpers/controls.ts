/**
 * The control scheme.
 *
 * For the values corresponding to the keys, please see:
 * https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 */
export const CONTROLS = {
    PAUSE_GAME: 'Escape',
    // The next two are only enabled when the game is over.
    // So no need to worry about overlaps.
    RESET_GAME: 'Enter',
    BACK_TO_MENU: 'Escape',

    MOVE_LEFT: 'ArrowLeft',
    MOVE_RIGHT: 'ArrowRight',
    SOFT_DROP: 'ArrowDown',
    HARD_DROP: 'ArrowUp',

    ROTATE_CW: ' ',
    ROTATE_CCW: 'Enter',

    HOLD_PIECE: '0',

    INSERT_GARBAGE: 'F1'
};
