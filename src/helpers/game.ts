import { deleteLine, getFullLines, newBoard, type Board } from './board';
import { spawnPiece, type Piece } from './pieces';
import { getRandomPiece } from './rng';

export type Game = {
    board: Board;
    currentPiece: Piece;
    gameOver: boolean;
    score: number;
    totalLines: number;
    lineCounter: number[]; // The specific line clears (Single, Double, Triple, Tetris)
    level: number;
    nextPieces: Piece[];
    currentDrop: number; // We need to keep track of how long the player is holding down in a row.
    ticks: number;
    holdPiece: Piece | null;
    holdThisTurn: boolean; // You can only toggle held pieces once per turn.
    pieceCounter: number[];
};

/**
 * Returns a new game.
 */
export const newGame = (): Game => {
    const nextPieces = [];
    for (let i = 0; i < 14; i++) {
        nextPieces.push(getRandomPiece());
    }

    const currentPiece = getRandomPiece();

    const game = {
        board: newBoard(),
        currentPiece: currentPiece,
        gameOver: false,
        score: 0,
        totalLines: 0,
        level: 1,
        nextPieces: nextPieces,
        currentDrop: 0,
        ticks: 0,
        holdPiece: null,
        holdThisTurn: true,
        pieceCounter: [0, 0, 0, 0, 0, 0, 0],
        lineCounter: [0, 0, 0, 0]
    };

    spawnPiece(game.board, currentPiece);

    // Incrementing the individual piece counts.
    switch (currentPiece.name) {
        case 'I':
            game.pieceCounter[0] += 1;
            break;
        case 'J':
            game.pieceCounter[1] += 1;
            break;
        case 'L':
            game.pieceCounter[2] += 1;
            break;
        case 'O':
            game.pieceCounter[3] += 1;
            break;
        case 'S':
            game.pieceCounter[4] += 1;
            break;
        case 'Z':
            game.pieceCounter[5] += 1;
            break;
        case 'T':
            game.pieceCounter[6] += 1;
            break;
        default:
            break;
    }

    return game;
};

/**
 * Handles a "turn" in the game, meaning spawning a new piece, checking for full lines, etc.
 */
export const nextTurn = (game: Game): void => {
    if (game.gameOver) {
        return;
    }

    // First we check for the lines that need to be deleted.
    const fullLines = getFullLines(game.board);

    for (let i = 0; i < fullLines.length; i++) {
        deleteLine(game.board, fullLines[i]);
    }

    game.totalLines += fullLines.length;
    game.lineCounter[fullLines.length - 1] += 1;

    game.score += getScore(fullLines.length, game.level);

    game.level = Math.floor(game.totalLines / 10) + 1;

    // We get the new piece from the stack of next pieces.
    const nextPiece = game.nextPieces[0];
    game.currentPiece = nextPiece;

    // Incrementing the individual piece counts.
    switch (game.currentPiece.name) {
        case 'I':
            game.pieceCounter[0] += 1;
            break;
        case 'J':
            game.pieceCounter[1] += 1;
            break;
        case 'L':
            game.pieceCounter[2] += 1;
            break;
        case 'O':
            game.pieceCounter[3] += 1;
            break;
        case 'S':
            game.pieceCounter[4] += 1;
            break;
        case 'Z':
            game.pieceCounter[5] += 1;
            break;
        case 'T':
            game.pieceCounter[6] += 1;
            break;
        default:
            break;
    }

    // Checking if the piece can spawn, if not this is an automatic game over.
    const b = spawnPiece(game.board, game.currentPiece);
    if (!b) {
        game.gameOver = true;
    }

    // Then we append a new random piece to the next piece bag.
    const newPiece = getRandomPiece();

    game.nextPieces.push(newPiece);
    game.nextPieces.shift();

    // After all of that we reset the ticks and the ability to hold a new piece.
    game.ticks = 0;
    game.holdThisTurn = true;
};

/**
 * Gets the score based on the amount of lines cleared at onces and the current level.
 */
export const getScore = (linesCleared: number, level: number): number => {
    // This is from the NES Tetris scoring algorithm.
    switch (linesCleared) {
        case 1:
            return 40 * level;
        case 2:
            return 100 * level;
        case 3:
            return 300 * level;
        case 4:
            return 1200 * level;
        default:
            return 0;
    }
};

/**
 * Gets the amount of seconds before a piece falls down by one grid.
 * These are from the original NES Version of Tetris (But we start at level 1 instead of 0).
 * The original game runs at 60(~ish) frames per second.
 */
export const getFallSpeed = (level: number): number => {
    if (level < 10) {
        // It scales linearly up until NES Level 8 (Our Level 9).
        return 53 - 5 * level;
    } else if (level < 11) {
        return 6;
    } else if (level < 14) {
        return 5;
    } else if (level < 17) {
        return 4;
    } else if (level < 20) {
        return 3;
    } else if (level < 30) {
        return 2;
    } else {
        return 1;
    }
};
