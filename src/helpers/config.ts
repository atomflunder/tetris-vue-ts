/**
 * Gets a config setting from local storage.
 */
export const getConfig = (config: string, defaultValue: string): string => {
    const c = localStorage.getItem(`config-${config}`);
    if (c === null) {
        return defaultValue;
    }
    return c;
};

/**
 * Sets a config setting to local storage.
 */
export const setConfig = (config: string, value: string, isBool: boolean): void => {
    // First we set the correct value in memory.
    if (isBool) {
        CONFIG[config as keyof typeof CONFIG].value = value === 'true';
    } else {
        CONFIG[config as keyof typeof CONFIG].value = Number(value);
    }

    // And then in storage too.
    localStorage.setItem(`config-${config}`, value);
};

/**
 *  The configuration options for the game. If an option isn't set we use a default value.
 */
export const CONFIG = {
    /**
     * The volume level of the game.
     */
    VOLUME: {
        name: 'VOLUME',
        defaultValue: '0.25',
        value: Number(getConfig('VOLUME', '0.25'))
    },

    /**
     * Displays some debug information on the game info screen.
     * Used for development purposes.
     */
    SHOW_DEBUG_INFO: {
        name: 'SHOW_DEBUG_INFO',
        defaultValue: 'false',
        value: getConfig('SHOW_DEBUG_INFO', 'false') === 'true'
    },

    /**
     * If the dropped pieces should stay their respective color or not.
     * When set to false, all pieces will be greyed out once dropped.
     */
    COLORED_BOARD: {
        name: 'COLORED_BOARD',
        defaultValue: 'true',
        value: getConfig('COLORED_BOARD', 'true') === 'true'
    },

    /**
     * If you want to enable the ghost piece that shows up at the bottom of the pieces.
     */
    GHOST_PIECE: {
        name: 'GHOST_PIECE',
        defaultValue: 'true',
        value: getConfig('GHOST_PIECE', 'true') === 'true'
    },

    /**
     * The delay you get when clearing lines, in milliseconds.
     * Can be set to 0 (or lower) for no delay at all.
     * Most games use a value between 400 to 700.
     */
    LINE_CLEAR_DELAY: {
        name: 'LINE_CLEAR_DELAY',
        defaultValue: '300',
        value: Number(getConfig('LINE_CLEAR_DELAY', '300'))
    },

    /**
     * If you want to use a modern piece generator,
     * which makes sure you see each piece equally often.
     *
     * If disabled, the piece is truly randonly generated.
     *
     * See more information here: https://tetris.fandom.com/wiki/Random_Generator
     */
    MODERN_PIECE_RNG: {
        name: 'MODERN_PIECE_RNG',
        defaultValue: 'true',
        value: getConfig('MODERN_PIECE_RNG', 'true') === 'true'
    },

    /**
     * The amount of piece bags generated at once.
     * A piece bag is used in the RNG generator to make sure that you get an equal amount of pieces.
     * One bag is made up of 1 of every 7 tetrominoes,
     * so that means that 3 bags would yield 3 of every tetrominoe and the bag ends up being 21 pieces big.
     * This in turn means that you cannot go more than X * 12 without seeing a specific piece,
     * and you cannot get more a piece more than X * 2 in a row.
     *
     * This only has an effect if you have modern piece RNG enabled.
     *
     * See more information here: https://tetris.fandom.com/wiki/Random_Generator
     */
    PIECE_BAG_AMOUNT: {
        name: 'PIECE_BAG_AMOUNT',
        defaultValue: '1',
        value: Number(getConfig('PIECE_BAG_AMOUNT', '1'))
    },

    /**
     * If this option is enabled, the very first piece cannot generate an overhang.
     * These pieces being the S and Z pieces, but an O piece can generate an overhang too if you draw a S/Z after.
     * Meaning the first piece will always be either L, J, I, or T.
     *
     * This only has an effect if you have modern piece RNG enabled.
     */
    FIRST_PIECE_NO_OVERHANG: {
        name: 'FIRST_PIECE_NO_OVERHANG',
        defaultValue: 'true',
        value: getConfig('FIRST_PIECE_NO_OVERHANG', 'true') === 'true'
    },

    /**
     * This is the amount of ticks that a piece will wait before locking when it falls.
     * A tick is 1/60th of a second.
     * The player moving a piece successfully will reset this timer.
     *
     * See more information here: https://tetris.fandom.com/wiki/Lock_delay
     */
    PIECE_LOCK_TICKS: {
        name: 'PIECE_LOCK_TICKS',
        defaultValue: '30',
        value: Number(getConfig('PIECE_LOCK_TICKS', '30'))
    },

    /**
     * The amount of moves that can reset the lock delay.
     * After X moves, the lock delay will no longer refresh and lock a piece in place.
     *
     * Set this to -1 for an infinite amount of resets.
     *
     * See more information here: https://tetris.fandom.com/wiki/Infinity
     */
    LOCK_MOVE_RESETS: {
        name: 'LOCK_MOVE_RESETS',
        defaultValue: '15',
        value: Number(getConfig('LOCK_MOVE_RESETS', '15'))
    },

    /**
     * The initial delay of when DAS kicks in, in milliseconds.
     *
     * See more information here: https://tetris.fandom.com/wiki/DAS
     */
    DAS_DELAY: {
        name: 'DAS_DELAY',
        defaultValue: '167',
        value: Number(getConfig('DAS_DELAY', '167'))
    },

    /**
     * The speed of the DAS, in milliseconds.
     *
     * See more information here: https://tetris.fandom.com/wiki/DAS
     */
    ARR_SPEED: {
        name: 'ARR_SPEED',
        defaultValue: '33',
        value: Number(getConfig('ARR_SPEED', '33'))
    }
};
