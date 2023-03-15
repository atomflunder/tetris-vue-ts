import type { Board } from './board';
import { nextTurn, type Game } from './game';
import { getDefaultPiece } from './pieceData';

export type Piece = {
    name: string;
    color: number;
    currentRotation: number;
    rotations: number[][][];
    offset: number[];
};

enum Direction {
    // You cannot really ever move a piece up in tetris.
    Down,
    Left,
    Right
}

/**
 * This function spawns a piece on the game board and returns if the spawn succeeded.
 */
export const spawnPiece = (board: Board, piece: Piece): boolean => {
    // First we reset the position of the piece.
    resetPiece(piece);

    const gb: number[][] = board.GameBoard;

    const pieceBlocks = getPieceCoordinates(piece);

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
        gb[coords[0]][coords[1]] = piece.color;
    }

    return true;
};

/**
 * Holds a piece and spawns either the currently held piece, or the next one from the stack if you are not holding one.
 * Returns if the operation succeeded.
 */
export const holdPiece = (game: Game): boolean => {
    // You can only hold a piece one time per turn, otherwise you could just stall forever.
    if (!game.holdThisTurn) {
        return false;
    }

    // Despawning the current piece.
    const pieceCoordinates = getPieceCoordinates(game.currentPiece);
    for (let i = 0; i < pieceCoordinates.length; i++) {
        const coords = pieceCoordinates[i];
        game.board.GameBoard[coords[0]][coords[1]] = 0;
    }

    // If you are not currently holding a piece, it is like ending your turn, kind of.
    if (!game.holdPiece) {
        game.holdPiece = game.currentPiece;
        nextTurn(game);
        // But we have to make sure to set this to false.
        game.holdThisTurn = false;
        return true;
    }

    // If you are holding a piece, we swap the current piece and the hold piece.
    const bufferPiece = game.currentPiece;
    game.currentPiece = game.holdPiece;
    game.holdPiece = bufferPiece;

    // Then spawning the previously held piece.

    spawnPiece(game.board, game.currentPiece);

    // Also need to set the ticks to 0 manually.
    game.ticks = 0;
    // And of course turn off the ability to swap again.
    game.holdThisTurn = false;

    return true;
};

export const rotatePiece = (board: Board, piece: Piece, clockwise: boolean): boolean => {
    let nextRotation = (piece.currentRotation + (clockwise ? 1 : -1)) % 4;
    if (nextRotation === -1) {
        nextRotation += 4;
    }

    const pieceCoordinates = getPieceCoordinates(piece);

    const wallKick = getCorrectWallKick(piece, board, nextRotation, clockwise);

    if (wallKick === null) {
        return false;
    }

    // We first set all "old" blocks to zero, before setting the new blocks to 1.
    for (let i = 0; i < pieceCoordinates.length; i++) {
        const coords = pieceCoordinates[i];
        board.GameBoard[coords[0]][coords[1]] = 0;
    }

    piece.currentRotation = nextRotation;

    // These are intentionally swapped due to the wall kick coordinates being X/Y and the offset being Y/X.
    piece.offset[0] += wallKick[1];
    piece.offset[1] += wallKick[0];

    const newPieceBlocks = getPieceCoordinates(piece);

    for (let i = 0; i < newPieceBlocks.length; i++) {
        const coords = newPieceBlocks[i];
        board.GameBoard[coords[0]][coords[1]] = piece.color;
    }

    return true;
};

/**
 * This function moves a piece down by 1 and returns if the move succeeded.
 */
export const movePieceDown = (board: Board, piece: Piece): boolean => {
    const pieceBlocks = getPieceCoordinates(piece);
    // These are the blocks that face down from the given piece, we check for collision on those.
    const blocksToBeCollidedWith = getCollisionBlocks(pieceBlocks, Direction.Down);

    for (let i = 0; i < blocksToBeCollidedWith.length; i++) {
        const coords = blocksToBeCollidedWith[i];
        if (coords[0] >= board.GameBoard.length || board.GameBoard[coords[0]][coords[1]] !== 0) {
            return false;
        }
    }

    // We first set all "old" blocks to zero, before setting the new blocks to 1.
    for (let i = 0; i < pieceBlocks.length; i++) {
        const coords = pieceBlocks[i];
        board.GameBoard[coords[0]][coords[1]] = 0;
    }

    piece.offset[0] += 1;

    const newPieceBlocks = getPieceCoordinates(piece);

    for (let i = 0; i < pieceBlocks.length; i++) {
        const coords = newPieceBlocks[i];
        board.GameBoard[coords[0]][coords[1]] = piece.color;
    }

    return true;
};

/**
 * This function drops a piece down as far as it will go.
 * Returns how many spaces the piece has fallen.
 */
export const dropPieceDown = (board: Board, piece: Piece): number => {
    let fallen = 0;
    let result = true;

    while (result) {
        result = movePieceDown(board, piece);
        fallen++;
    }

    return fallen;
};

/**
 * This function moves a piece left by 1 and returns if the move succeeded.
 */
export const movePieceLeft = (board: Board, piece: Piece): boolean => {
    const pieceBlocks = getPieceCoordinates(piece);
    // These are the blocks that face left from the given piece, we check for collision on those.
    const blocksToBeCollidedWith = getCollisionBlocks(pieceBlocks, Direction.Left);

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

    piece.offset[1] -= 1;

    const newPieceBlocks = getPieceCoordinates(piece);

    for (let i = 0; i < pieceBlocks.length; i++) {
        const coords = newPieceBlocks[i];
        board.GameBoard[coords[0]][coords[1]] = piece.color;
    }

    return true;
};

/**
 * This function moves a piece right by 1 and returns if the move succeeded.
 */
export const movePieceRight = (board: Board, piece: Piece): boolean => {
    const pieceBlocks = getPieceCoordinates(piece);
    // These are the blocks that face right from the given piece, we check for collision on those.
    const blocksToBeCollidedWith = getCollisionBlocks(pieceBlocks, Direction.Right);

    for (let i = 0; i < blocksToBeCollidedWith.length; i++) {
        const coords = blocksToBeCollidedWith[i];
        if (coords[1] >= board.GameBoard[i].length || board.GameBoard[coords[0]][coords[1]] !== 0) {
            return false;
        }
    }

    // We first set all "old" blocks to zero, before setting the new blocks to 1.
    for (let i = 0; i < pieceBlocks.length; i++) {
        const coords = pieceBlocks[i];
        board.GameBoard[coords[0]][coords[1]] = 0;
    }

    piece.offset[1] += 1;

    const newPieceBlocks = getPieceCoordinates(piece);

    for (let i = 0; i < pieceBlocks.length; i++) {
        const coords = newPieceBlocks[i];
        board.GameBoard[coords[0]][coords[1]] = piece.color;
    }
    return true;
};

/**
 * This function gets the current coordinates of a piece.
 */
export const getPieceCoordinates = (piece: Piece): number[][] => {
    const pieceBlocks: number[][] = [];

    for (let i = 0; i < piece.rotations[piece.currentRotation].length; i++) {
        for (let j = 0; j < piece.rotations[piece.currentRotation][i].length; j++) {
            if (piece.rotations[piece.currentRotation][i][j] !== 0) {
                pieceBlocks.push([i + piece.offset[0], j + piece.offset[1]]);
            }
        }
    }

    return pieceBlocks;
};

/**
 * This function gets the coordinates of a "shadow" piece.
 * Meaning a piece, if it were to be dropped as far as it will go in the current position.
 */
export const getShadowPieceCoordinates = (board: Board, piece: Piece): number[][] => {
    // Creating copies of the piece and board because we are only pretending to drop a piece.
    const shadowPiece: Piece = JSON.parse(JSON.stringify(piece));
    const shadowBoard: Board = JSON.parse(JSON.stringify(board));

    dropPieceDown(shadowBoard, shadowPiece);

    return getPieceCoordinates(shadowPiece);
};

/**
 * Returns the coordinates of the blocks that the piece will collide with, if moved in that direction.
 * Excludes blocks of the same piece.
 */
export const getCollisionBlocks = (
    pieceCoordinates: number[][],
    direction: Direction
): number[][] => {
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
 * Resets a piece back to its original position and rotation.
 */
export const resetPiece = (piece: Piece): void => {
    piece.offset = [0, 3];
    piece.currentRotation = 0;
};

/**
 * Gets a neatly formatted 4x4 table with a single piece.
 * Used in the preview for upcoming pieces, held pieces and piece counts.
 */
export const getPreviewPieceTable = (nextPieces: Piece[]): number[][] => {
    const table: number[][] = [];

    for (let i = 0; i < nextPieces.length; i++) {
        table.push([0, 0, 0, 0]);
        table.push(...getDefaultPiece(nextPieces[i].name));
    }

    table.push([0, 0, 0, 0]);

    return table;
};

/**
 * Gets you the wall kick offsets for each piece.
 * The first one is always [0, 0].
 * This is taken from: https://tetris.fandom.com/wiki/SRS#Wall_Kicks
 */
export const getWallKicks = (piece: Piece, clockwise: boolean): number[][] => {
    const currentRotation = piece.currentRotation;

    const wallKicks: number[][] = [];

    wallKicks.push([0, 0]);

    // The O piece does not kick.
    if (piece.name === 'O') {
        return wallKicks;
    }

    // The I piece has special kick values due to its shape.
    if (piece.name === 'I') {
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
const getCorrectWallKick = (
    piece: Piece,
    board: Board,
    nextRotation: number,
    clockwise: boolean
): number[] | null => {
    const wallKicks = getWallKicks(piece, clockwise);

    const pieceCoordinates = getPieceCoordinates(piece);

    // We are looping through the possible wall kicks.
    wallKickLoop: for (let i = 0; i < wallKicks.length; i++) {
        const pieceOffset = wallKicks[i];

        const rotatedPiece: Piece = {
            ...piece,
            currentRotation: nextRotation
        };

        console.log(rotatedPiece.offset);

        // We apply the wallkick to the piece offsets.
        // These are intentionally swapped due to the wall kick coordinates being X/Y and the offset being Y/X.
        rotatedPiece.offset = [
            rotatedPiece.offset[0] + pieceOffset[1],
            rotatedPiece.offset[1] + pieceOffset[0]
        ];

        console.log(rotatedPiece.offset);

        // Calculating the collision blocks with the initial piece in mind.
        let collisionBlocks = getPieceCoordinates(rotatedPiece);

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
        console.log(`Rotating piece with ${i} wall kicks.`);
        return wallKicks[i];
    }

    // And if none fit, we return null.
    return null;
};
