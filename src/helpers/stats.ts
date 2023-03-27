import type { Game } from './game';

/**
 * Returns a statistic from local memory.
 */
export const getStat = (type: string): number => {
    return Number(localStorage.getItem(`stats-${type}`));
};

/**
 * Adds a statistic to the saved value.
 */
export const increaseStats = (type: string, increment: number): void => {
    const s = Number(localStorage.getItem(`stats-${type}`));

    localStorage.setItem(`stats-${type}`, (s + increment).toString());
};

/**
 * Adds the stats of the game to the saved values.
 */
export const incrementLifetimeStats = (game: Game): void => {
    increaseStats('GAMES_PLAYED', 1);
    increaseStats('TOTAL_SCORE', game.score);
    increaseStats('PLAY_TIME', game.timer.currentTime);
    increaseStats(
        'PIECES',
        game.pieceCounter.reduce((a, b) => a + b)
    );
    increaseStats('TOTAL_LINES', game.totalLines);
    increaseStats('SINGLE_LINES', game.lineCounter[0]);
    increaseStats('DOUBLE_LINES', game.lineCounter[1]);
    increaseStats('TRIPLE_LINES', game.lineCounter[2]);
    increaseStats('TETRIS_LINES', game.lineCounter[3]);
    increaseStats('T_SPIN_MINI', game.tSpinCounter[0]);
    increaseStats('T_SPIN_FULL', game.tSpinCounter[1]);
};
