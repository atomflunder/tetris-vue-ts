import type { Game } from './game';

/**
 * Gets you the CSS style class of a block on the playing field.
 */
export const getColorClass = (game: Game, block: number, i: number, j: number): string => {
    switch (block) {
        case 1:
            return 'i block';
        case 2:
            return 'j block';
        case 3:
            return 'l block';
        case 4:
            return 'o block';
        case 5:
            return 's block';
        case 6:
            return 'z block';
        case 7:
            return 't block';
        case 8:
            // Used for garbage blocks and the greyed out hold piece.
            return 'greyed-out block';
        case 9:
            // Used for full lines.
            return 'white block';
        default:
            // If the piece is not filled in, we check if it is occupied by a "shadow" piece.
            // If that is the case, we render a slightly transparent color of the current piece.
            for (let k = 0; k < game.shadowPiece.length; k++) {
                if (game.shadowPiece[k][0] === i && game.shadowPiece[k][1] === j) {
                    return `${game.currentPiece.name.toLowerCase()} block transparent`;
                }
            }
            // And if not, just an empty block.
            return 'empty block';
    }
};

/**
 * Gets you the CSS style class of the held piece preview,
 * which is greyed out if you cannot swap the held piece.
 */
export const getHeldPieceColor = (game: Game, block: number): string => {
    // If you can toggle the hold this "turn" we return the standard colors.
    if (game.canHold) {
        return getColorClass(game, block, -1, -1) + ' small-block';
    } else {
        // If you cannot toggle, we want the piece blocks to be greyed out.
        const color = getColorClass(game, block, -1, -1);
        if (color !== 'empty block') {
            return 'greyed-out empty small-block';
        } else {
            return 'empty small-block';
        }
    }
};

/**
 * Displaying some commonly and default used keys to be visually more appealing.
 */
export const keyToDisplay = (key: string): string => {
    switch (key) {
        case ' ':
            return 'SPACE';
        case 'ArrowLeft':
            return '◀';
        case 'ArrowRight':
            return '▶';
        case 'ArrowDown':
            return '▼';
        case 'ArrowUp':
            return '▲';

        default:
            return key.toUpperCase();
    }
};

/**
 * Gets you the CSS style class of the main table,
 * with a special glow for being in danger, paused, both, or having a high combo.
 */
export const getGlow = (game: Game): string => {
    if (game.finished) {
        return 'green-glow ';
    }
    if (game.board.firstRowsNotEmpty(game.currentPiece, 6) && game.paused) {
        return 'purple-glow ';
    }
    if (game.board.firstRowsNotEmpty(game.currentPiece, 6) || game.over) {
        return 'red-glow ';
    }
    if (game.paused) {
        return 'blue-glow ';
    }
    if (game.currentCombo > 4 || game.backToBack > 4) {
        return 'orange-glow ';
    } else {
        return '';
    }
};
