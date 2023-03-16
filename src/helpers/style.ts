import type { Game } from './game';

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
            // Maybe used for garbage blocks in the future.
            return 'greyed-out block';
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

export const getHeldPieceColor = (game: Game, block: number): string => {
    // If you can toggle the hold this "turn" we return the standard colors.
    if (game.holdThisTurn) {
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

export const isInDanger = (game: Game): string => {
    if (game.board.inDanger(game.currentPiece)) {
        return 'red-glow ';
    } else {
        return '';
    }
};
