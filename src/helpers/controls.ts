/**
 * Gets a keybind setting from local storage.
 */
export const getKeybind = (keybind: string, defaultValue: string): string => {
    const k = localStorage.getItem(`controls-${keybind}`);
    if (k === null) {
        return defaultValue;
    }
    return k;
};

/**
 * Sets a keybing setting to local storage.
 */
export const setKeybind = (keybind: string, value: string): void => {
    localStorage.setItem(`controls-${keybind}`, value);
};

/**
 * The control scheme.
 *
 * For the values corresponding to the keys, please see:
 * https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 */
export const CONTROLS = {
    PAUSE_GAME: getKeybind('PAUSE_GAME', 'Escape'),
    RESET_GAME: getKeybind('RESET_GAME', 'Enter'),
    BACK_TO_MENU: getKeybind('BACK_TO_MENU', 'Escape'),

    MOVE_LEFT: getKeybind('MOVE_LEFT', 'ArrowLeft'),
    MOVE_RIGHT: getKeybind('MOVE_RIGHT', 'ArrowRight'),
    SOFT_DROP: getKeybind('SOFT_DROP', 'ArrowDown'),
    HARD_DROP: getKeybind('HARD_DROP', 'ArrowUp'),

    ROTATE_CW: getKeybind('ROTATE_CW', ' '),
    ROTATE_CCW: getKeybind('ROTATE_CCW', 'Enter'),

    HOLD_PIECE: getKeybind('HOLD_PIECE', '0'),

    INSERT_GARBAGE: getKeybind('INSERT_GARBAGE', 'F1')
};
