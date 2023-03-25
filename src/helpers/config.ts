/**
 * Displays some debug information on the game info screen.
 * Used for development purposes.
 */
export const SHOW_DEBUG_INFO = false;

/**
 * If the dropped pieces should stay their respective color or not.
 * When set to false, all pieces will be greyed out once dropped.
 */
export const COLORED_BOARD = true;

/**
 * The delay you get when clearing lines, in milliseconds.
 * Can be set to 0 (or lower) for no delay at all.
 * Most games use a value between 400 to 700.
 */
export const LINE_CLEAR_DELAY = 300;

/**
 * If you want to use a modern piece generator,
 * which makes sure you see each piece equally often.
 *
 * If disabled, the piece is truly randonly generated.
 *
 * See more information here: https://tetris.fandom.com/wiki/Random_Generator
 */
export const MODERN_PIECE_RNG = true;

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
export const PIECE_BAG_AMOUNT = 1;

/**
 * If this option is enabled, the very first piece cannot generate an overhang.
 * These pieces being the S and Z pieces, but an O piece can generate an overhang too if you draw a S/Z after.
 * Meaning the first piece will always be either L, J, I, or T.
 *
 * This only has an effect if you have modern piece RNG enabled.
 */
export const FIRST_PIECE_NO_OVERHANG = true;

/**
 * This is the amount of ticks that a piece will wait before locking when it falls.
 * A tick is 1/60th of a second.
 * The player moving a piece successfully will reset this timer.
 *
 * See more information here: https://tetris.fandom.com/wiki/Lock_delay
 */
export const PIECE_LOCK_TICKS = 30;

/**
 * The amount of moves that can reset the lock delay.
 * After X moves, the lock delay will no longer refresh and lock a piece in place.
 *
 * Set this to -1 for an infinite amount of resets.
 *
 * See more information here: https://tetris.fandom.com/wiki/Infinity
 */
export const LOCK_MOVE_RESETS = 15;
