import type { Piece } from './pieces';

export class Board {
    GameBoard: number[][];

    constructor() {
        this.GameBoard = [
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
        ];
    }

    /**
     * Returns all indexes of full lines.
     */
    getFullLines = (): number[] => {
        const fullLines = [];

        for (let i = 0; i < this.GameBoard.length; i++) {
            const sum = this.GameBoard[i].filter((n) => n !== 0);
            if (sum.length === this.GameBoard[i].length) {
                fullLines.push(i);
            }
        }

        return fullLines;
    };

    /**
     * Delets a line from the board and inserts a new one.
     */
    deleteLine = (line: number): void => {
        this.GameBoard.splice(line, 1);
        this.GameBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    };

    /**
     * Returns if the player is "in danger", aka if the pieces reach up to a certain point.
     * Excluding the currently held piece.
     */
    inDanger = (currentPiece: Piece): boolean => {
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
            for (let j = 0; j < this.GameBoard[i].length; j++) {
                if (
                    this.GameBoard[i][j] !== 0 &&
                    !isItemInArray(currentPiece.getPieceCoordinates(), [i, j])
                ) {
                    // If so, the player is "in danger" and we return true.
                    return true;
                }
            }
        }

        // And if it is all clear, we return false.
        return false;
    };
}
