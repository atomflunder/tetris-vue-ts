import { getPieceCoordinates, type Piece } from './pieces';

export type Board = {
    GameBoard: number[][];
};

/**
 * Gets a new fresh board.
 */
export const newBoard = (): Board => {
    // The Tetris Game Board is 10x20.
    return {
        GameBoard: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    };
};
/**
 * Returns all indexes of full lines.
 */
export const getFullLines = (board: Board): number[] => {
    const fullLines = [];

    // A line is full if the sum of the line is equal to 10.
    for (let i = 0; i < board.GameBoard.length; i++) {
        const sum = board.GameBoard[i].filter((n) => n !== 0);
        if (sum.length === board.GameBoard[i].length) {
            fullLines.push(i);
        }
    }

    return fullLines;
};

/**
 * Delets a line from the board and inserts a new one.
 */
export const deleteLine = (board: Board, line: number): void => {
    board.GameBoard.splice(line, 1);
    board.GameBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
};

/**
 * Returns if the player is "in danger", aka if the pieces reach up to a certain point.
 * Excluding the currently held piece.
 */
export const inDanger = (board: Board, currentPiece: Piece): boolean => {
    // Creating a copy of the board, for modifying.
    const boardCoordinates = JSON.parse(JSON.stringify(board.GameBoard));

    // We only want to check the first couple of rows.
    const rowsChecked = 6;

    const pieceCoordinates = getPieceCoordinates(currentPiece);

    // First we set the values of the current piece to 0,
    // because we do not want the current piece to be accounted for.
    for (let i = 0; i < pieceCoordinates.length; i++) {
        const coords = pieceCoordinates[i];

        for (let j = 0; j < rowsChecked; j++) {
            for (let k = 0; k < boardCoordinates[k].length; k++) {
                if (coords[0] === j && coords[1] === k) {
                    boardCoordinates[j][k] = 0;
                }
            }
        }
    }

    // Then we check if the values are not 0, if so the player is in danger.
    for (let i = 0; i < rowsChecked; i++) {
        for (let j = 0; j < boardCoordinates[i].length; j++) {
            if (boardCoordinates[i][j] !== 0) {
                return true;
            }
        }
    }

    // And if it is all clear, we return false.
    return false;
};
