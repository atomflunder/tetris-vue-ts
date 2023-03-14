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
    // We only want to check the first couple of rows.
    const rowsChecked = 6;

    // From: https://stackoverflow.com/questions/24943200/javascript-2d-array-indexof
    function isItemInArray(array: Array<Array<number>>, item: Array<number>) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] == item[0] && array[i][1] == item[1]) {
                return true;
            }
        }
        return false;
    }

    // We check if the first X rows contain any piece that is not part of the currently held piece.
    for (let i = 0; i < rowsChecked; i++) {
        for (let j = 0; j < board.GameBoard[i].length; j++) {
            if (
                board.GameBoard[i][j] !== 0 &&
                !isItemInArray(getPieceCoordinates(currentPiece), [i, j])
            ) {
                // If so, the player is "in danger" and we return true.
                return true;
            }
        }
    }

    // And if it is all clear, we return false.
    return false;
};
