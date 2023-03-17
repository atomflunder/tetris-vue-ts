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

    insertGarbageLines = (amount: number, currentPiece: Piece): void => {
        const pieceBlocks = currentPiece.getCoordinates();

        // First we completely despawn the current piece.
        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = pieceBlocks[i];
            this.GameBoard[coords[0]][coords[1]] = 0;
        }

        for (let i = 0; i < amount; i++) {
            // Then we create and shuffle a garbage line with one empty space.
            const garbageLine = [8, 8, 8, 8, 8, 8, 8, 8, 8, 0];

            // From: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
            const shuffle = (a: Array<any>) => {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            };

            shuffle(garbageLine);

            // Then we insert it at the bottom of the board,
            // and remove the first row of the board to compensate.
            this.GameBoard.push(garbageLine);
            this.GameBoard.shift();
        }

        // We have to move the piece up once for each line spawned.
        currentPiece.offset[0] -= amount;

        if (currentPiece.offset[0] < 0) {
            currentPiece.offset[0] = 0;
        }

        // And then after the lines are inserted and the piece is shifted, we spawn the piece again.
        const newPieceBlocks = currentPiece.getCoordinates();
        for (let i = 0; i < newPieceBlocks.length; i++) {
            const coords = newPieceBlocks[i];
            this.GameBoard[coords[0]][coords[1]] = currentPiece.color;
        }
    };

    /**
     * Returns if the first X rows are empty, except for the current piece.
     */
    firstRowsEmpty = (currentPiece: Piece, rowsChecked: number): boolean => {
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
                    !isItemInArray(currentPiece.getCoordinates(), [i, j])
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
