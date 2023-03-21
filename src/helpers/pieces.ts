import type { Board } from './board';
import { Direction } from './types';

export class Piece {
    name: string;
    color: number;
    currentRotation: number;
    rotations: number[][][];
    offset: number[];

    constructor(
        name: string,
        color: number,
        rotations: number[][][],
        currentRotation: number = 0,
        offset: number[] = [0, 3]
    ) {
        this.name = name;
        this.color = color;
        this.rotations = rotations;
        this.currentRotation = currentRotation;
        this.offset = offset;
    }

    /**
     * Resets a piece back to its original position and rotation.
     */
    reset = (): void => {
        this.offset = [0, 3];
        this.currentRotation = 0;
    };

    /**
     * This function spawns a piece on the game board and returns if the spawn succeeded.
     */
    spawn = (board: Board): boolean => {
        // First we reset the position of the piece.
        this.reset();

        const gb: number[][] = board.GameBoard;

        const pieceBlocks = this.getCoordinates();

        // First we check if the board is already full at the coordinates that we want the piece to spawn in.
        // This is an automatic game over.
        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = pieceBlocks[i];
            if (gb[coords[0]][coords[1]] !== 0) {
                return false;
            }
        }

        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = pieceBlocks[i];
            gb[coords[0]][coords[1]] = this.color;
        }

        return true;
    };

    /**
     * This function gets the current coordinates of a piece.
     */
    getCoordinates = (): number[][] => {
        const pieceBlocks: number[][] = [];

        for (let i = 0; i < this.rotations[this.currentRotation].length; i++) {
            for (let j = 0; j < this.rotations[this.currentRotation][i].length; j++) {
                if (this.rotations[this.currentRotation][i][j] !== 0) {
                    pieceBlocks.push([i + this.offset[0], j + this.offset[1]]);
                }
            }
        }

        return pieceBlocks;
    };

    /**
     * Returns the coordinates of the blocks that the piece will collide with, if moved in that direction.
     * Excludes blocks of the same piece.
     */
    getCollisionBlocks = (direction: Direction): number[][] => {
        const pieceCoordinates = this.getCoordinates();

        const collisionBlocks: number[][] = [];

        if (direction === Direction.Down) {
            for (let i = 0; i < pieceCoordinates.length; i++) {
                collisionBlocks.push([pieceCoordinates[i][0] + 1, pieceCoordinates[i][1]]);
            }
        } else {
            const shiftedBy = direction === Direction.Left ? -1 : 1;

            for (let i = 0; i < pieceCoordinates.length; i++) {
                collisionBlocks.push([pieceCoordinates[i][0], pieceCoordinates[i][1] + shiftedBy]);
            }
        }

        return collisionBlocks.filter((b) => {
            for (let i = 0; i < pieceCoordinates.length; i++) {
                if (b[0] === pieceCoordinates[i][0] && b[1] === pieceCoordinates[i][1]) {
                    return false;
                }
            }
            return true;
        });
    };

    /**
     * Rotates a piece either clockwise or counter-clockwise, with wall kicks.
     */
    rotate = (board: Board, clockwise: boolean): boolean => {
        // Can't rotate an O.
        if (this.name === 'O') {
            return false;
        }

        let nextRotation = (this.currentRotation + (clockwise ? 1 : -1)) % 4;
        if (nextRotation === -1) {
            nextRotation += 4;
        }

        const pieceCoordinates = this.getCoordinates();

        const wallKick = this.getCorrectWallKick(board, nextRotation, clockwise);

        if (wallKick === null) {
            return false;
        }

        // We first set all "old" blocks to zero, before setting the new blocks to 1.
        for (let i = 0; i < pieceCoordinates.length; i++) {
            const coords = pieceCoordinates[i];
            board.GameBoard[coords[0]][coords[1]] = 0;
        }

        this.currentRotation = nextRotation;

        // These are intentionally swapped due to the wall kick coordinates being X/Y and the offset being Y/X.
        this.offset[0] += wallKick[1];
        this.offset[1] += wallKick[0];

        const newPieceBlocks = this.getCoordinates();

        for (let i = 0; i < newPieceBlocks.length; i++) {
            const coords = newPieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = this.color;
        }

        return true;
    };

    /**
     * This function moves a piece down by 1 and returns if the move succeeded.
     */
    moveDown = (board: Board): boolean => {
        const pieceBlocks = this.getCoordinates();
        // These are the blocks that face down from the given piece, we check for collision on those.
        const blocksToBeCollidedWith = this.getCollisionBlocks(Direction.Down);

        for (let i = 0; i < blocksToBeCollidedWith.length; i++) {
            const coords = blocksToBeCollidedWith[i];
            if (
                coords[0] >= board.GameBoard.length ||
                board.GameBoard[coords[0]][coords[1]] !== 0
            ) {
                return false;
            }
        }

        // We first set all "old" blocks to zero, before setting the new blocks to 1.
        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = pieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = 0;
        }

        this.offset[0] += 1;

        const newPieceBlocks = this.getCoordinates();

        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = newPieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = this.color;
        }

        return true;
    };

    /**
     * This function drops a piece down as far as it will go.
     * Returns how many spaces the piece has fallen.
     */
    dropDown = (board: Board): number => {
        let fallen = 0;
        let result = true;

        while (result) {
            result = this.moveDown(board);
            fallen++;
        }

        return fallen;
    };

    /**
     * This function moves a piece left by 1 and returns if the move succeeded.
     */
    moveLeft = (board: Board): boolean => {
        const pieceBlocks = this.getCoordinates();
        // These are the blocks that face left from the given piece, we check for collision on those.
        const blocksToBeCollidedWith = this.getCollisionBlocks(Direction.Left);

        for (let i = 0; i < blocksToBeCollidedWith.length; i++) {
            const coords = blocksToBeCollidedWith[i];
            if (coords[1] < 0 || board.GameBoard[coords[0]][coords[1]] !== 0) {
                return false;
            }
        }

        // We first set all "old" blocks to zero, before setting the new blocks to 1.
        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = pieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = 0;
        }

        this.offset[1] -= 1;

        const newPieceBlocks = this.getCoordinates();

        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = newPieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = this.color;
        }

        return true;
    };

    /**
     * This function moves a piece right by 1 and returns if the move succeeded.
     */
    moveRight = (board: Board): boolean => {
        const pieceBlocks = this.getCoordinates();
        // These are the blocks that face right from the given piece, we check for collision on those.
        const blocksToBeCollidedWith = this.getCollisionBlocks(Direction.Right);

        for (let i = 0; i < blocksToBeCollidedWith.length; i++) {
            const coords = blocksToBeCollidedWith[i];
            if (
                coords[1] >= board.GameBoard[i].length ||
                board.GameBoard[coords[0]][coords[1]] !== 0
            ) {
                return false;
            }
        }

        // We first set all "old" blocks to zero, before setting the new blocks to 1.
        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = pieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = 0;
        }

        this.offset[1] += 1;

        const newPieceBlocks = this.getCoordinates();

        for (let i = 0; i < pieceBlocks.length; i++) {
            const coords = newPieceBlocks[i];
            board.GameBoard[coords[0]][coords[1]] = this.color;
        }
        return true;
    };

    /**
     * Gets you the wall kick offsets for each piece.
     * The first one is always [0, 0].
     * This is taken from: https://tetris.fandom.com/wiki/SRS#Wall_Kicks
     */
    getWallKicks = (clockwise: boolean): number[][] => {
        const currentRotation = this.currentRotation;

        const wallKicks: number[][] = [];

        wallKicks.push([0, 0]);

        // The O piece does not kick.
        if (this.name === 'O') {
            return wallKicks;
        }

        // The I piece has special kick values due to its shape.
        if (this.name === 'I') {
            if (currentRotation === 0) {
                clockwise
                    ? wallKicks.push([-2, 0], [1, 0], [-2, -1], [1, 2]) // 0 >> 1
                    : wallKicks.push([-1, 0], [2, 0], [-1, 2], [2, -1]); // 0 >> 3
            } else if (currentRotation === 1) {
                clockwise
                    ? wallKicks.push([-1, 0], [2, 0], [-1, 2], [2, -1]) // 1 >> 2
                    : wallKicks.push([2, 0], [-1, 0], [2, 1], [-1, 2]); // 1 >> 0
            } else if (currentRotation === 2) {
                clockwise
                    ? wallKicks.push([2, 0], [-1, 0], [2, 1], [-1, -2]) // 2 >> 3
                    : wallKicks.push([1, 0], [-2, 0], [1, -2], [-2, 1]); // 2 >> 1
            } else if (currentRotation == 3) {
                clockwise
                    ? wallKicks.push([1, 0], [-2, 0], [1, -2], [-2, 1]) // 3 >> 0
                    : wallKicks.push([-2, 0], [1, 0], [-2, -1], [1, 2]); // 3 >> 2
            }

            return wallKicks;
        }

        // And the J, L, T, S, and Z pieces all share kick values.
        if (currentRotation === 0) {
            clockwise
                ? wallKicks.push([-1, 0], [-1, 1], [0, -2], [-1, -2]) // 0 >> 1
                : wallKicks.push([1, 0], [1, 1], [0, -2], [1, -2]); // 0 >> 3
        } else if (currentRotation === 1) {
            clockwise
                ? wallKicks.push([1, 0], [1, -1], [0, 2], [1, 2]) // 1 >> 2
                : wallKicks.push([1, 0], [1, -1], [0, 2], [1, 2]); // 1 >> 0
        } else if (currentRotation === 2) {
            clockwise
                ? wallKicks.push([1, 0], [1, 1], [0, -2], [1, -2]) // 2 >> 3
                : wallKicks.push([-1, 0], [-1, 1], [0, -2], [-1, -2]); // 2 >> 1
        } else if (currentRotation == 3) {
            clockwise
                ? wallKicks.push([-1, 0], [-1, -1], [0, 2], [-1, 2]) // 3 >> 0
                : wallKicks.push([-1, 0], [-1, -1], [0, 2], [-1, 2]); // 3 >> 2
        }

        return wallKicks;
    };

    /**
     * This function gets the correct wall kick.
     * Loops through every possible one and chooses the first valid one.
     * If no wall kicks are valid this will return null.
     */
    getCorrectWallKick = (
        board: Board,
        nextRotation: number,
        clockwise: boolean
    ): number[] | null => {
        const wallKicks = this.getWallKicks(clockwise);

        const pieceCoordinates = this.getCoordinates();

        // We are looping through the possible wall kicks.
        wallKickLoop: for (let i = 0; i < wallKicks.length; i++) {
            const pieceOffset = wallKicks[i];

            const rotatedPiece = new Piece(
                this.name,
                this.color,
                this.rotations,
                nextRotation,
                this.offset
            );

            // We apply the wallkick to the piece offsets.
            // These are intentionally swapped due to the wall kick coordinates being X/Y and the offset being Y/X.
            rotatedPiece.offset = [
                rotatedPiece.offset[0] + pieceOffset[1],
                rotatedPiece.offset[1] + pieceOffset[0]
            ];

            // Calculating the collision blocks with the initial piece in mind.
            let collisionBlocks = rotatedPiece.getCoordinates();

            collisionBlocks = collisionBlocks.filter((b) => {
                for (let j = 0; j < pieceCoordinates.length; j++) {
                    if (b[0] === pieceCoordinates[j][0] && b[1] === pieceCoordinates[j][1]) {
                        return false;
                    }
                }
                return true;
            });

            // And then if the piece does not fit we continue the loop.
            for (let j = 0; j < collisionBlocks.length; j++) {
                const coords = collisionBlocks[j];
                if (
                    coords[0] < 0 ||
                    coords[0] >= board.GameBoard.length ||
                    coords[1] < 0 ||
                    coords[1] >= board.GameBoard[0].length ||
                    board.GameBoard[coords[0]][coords[1]] !== 0
                ) {
                    continue wallKickLoop;
                }
            }

            // If the piece fits we return the wall kick position.
            return wallKicks[i];
        }

        // And if none fit, we return null.
        return null;
    };

    /**
     * This function gets the coordinates of a "shadow" piece.
     * Meaning a piece, if it were to be dropped as far as it will go in the current position.
     */
    getShadowPieceCoordinates = (board: Board): number[][] => {
        // Creating copies of the piece and board because we are only pretending to drop a piece.
        const copyPiece: Piece = JSON.parse(JSON.stringify(this));

        // Need to actually create a new piece because of the methods though.
        const shadowPiece: Piece = new Piece(
            copyPiece.name,
            copyPiece.color,
            copyPiece.rotations,
            copyPiece.currentRotation,
            copyPiece.offset
        );
        const shadowBoard: Board = JSON.parse(JSON.stringify(board));

        shadowPiece.dropDown(shadowBoard);

        return shadowPiece.getCoordinates();
    };
}
