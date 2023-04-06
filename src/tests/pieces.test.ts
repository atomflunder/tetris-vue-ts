import { Board } from '@/helpers/board';
import { allPieces } from '@/helpers/pieceData';
import { Piece } from '@/helpers/pieces';
import { Direction } from '@/helpers/types';
import { expect, test } from 'vitest';

test('New Piece', () => {
    const piece = new Piece('I', 1, [], 0, [0, 3]);

    expect(piece.name).toBe('I');
    expect(piece.color).toBe(1);
    expect(piece.currentRotation).toBe(0);
    expect(piece.offset).toEqual([0, 3]);
});

test('Reset Piece', () => {
    const piece = new Piece('I', 1, [], 3, [4, 12]);

    expect(piece.currentRotation).toBe(3);
    expect(piece.offset).toEqual([4, 12]);

    piece.reset();

    expect(piece.currentRotation).toBe(0);
    expect(piece.offset).toEqual([0, 3]);
});

test('Spawn Piece', () => {
    const board = new Board();
    const piece = allPieces[0];

    piece.spawn(board);

    expect(board.GameBoard[1]).toEqual([0, 0, 0, 1, 1, 1, 1, 0, 0, 0]);
});

test('Get Piece Coordinates', () => {
    const piece = allPieces[0];

    expect(piece.getCoordinates()).toEqual([
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6]
    ]);

    piece.offset = [12, 4];

    expect(piece.getCoordinates()).toEqual([
        [13, 4],
        [13, 5],
        [13, 6],
        [13, 7]
    ]);

    piece.currentRotation = 1;

    expect(piece.getCoordinates()).toEqual([
        [12, 6],
        [13, 6],
        [14, 6],
        [15, 6]
    ]);
});

test('Get Collision Blocks', () => {
    const piece = allPieces[0];
    piece.reset();

    expect(piece.getCollisionBlocks(Direction.Left)).toEqual([[1, 2]]);
    expect(piece.getCollisionBlocks(Direction.Right)).toEqual([[1, 7]]);

    piece.currentRotation = 1;

    expect(piece.getCollisionBlocks(Direction.Left)).toEqual([
        [0, 4],
        [1, 4],
        [2, 4],
        [3, 4]
    ]);
    expect(piece.getCollisionBlocks(Direction.Right)).toEqual([
        [0, 6],
        [1, 6],
        [2, 6],
        [3, 6]
    ]);

    piece.reset();
});

test('Rotate Piece', () => {
    const board = new Board();
    const oPiece = allPieces[3];
    const tPiece = allPieces[6];

    expect(oPiece.rotate(board, true, false)).toBe(false);
    expect(tPiece.rotate(board, false, false)).toBe(true);
    expect(tPiece.rotate(board, false, false)).toBe(true);
    expect(tPiece.rotate(board, false, false)).toBe(true);
    expect(tPiece.rotate(board, false, false)).toBe(true);
    expect(tPiece.rotate(board, false, false)).toBe(true);

    board.GameBoard[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[2] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[3] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];

    expect(tPiece.rotate(board, true, false)).toBe(false);

    oPiece.reset();
    tPiece.reset();
});

test('Move Piece Down', () => {
    const board = new Board();
    const tPiece = allPieces[6];

    expect(tPiece.moveDown(board)).toBe(true);

    expect(tPiece.offset).toEqual([1, 3]);

    board.GameBoard[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[2] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[3] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[4] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];

    expect(tPiece.moveDown(board)).toBe(false);

    expect(tPiece.offset).toEqual([1, 3]);

    tPiece.reset();
});

test('Drop Piece Down', () => {
    const board = new Board();
    const tPiece = allPieces[6];

    expect(tPiece.dropDown(board)).toBe(21);

    tPiece.offset = [4, 3];

    expect(tPiece.dropDown(board)).toBe(15);

    tPiece.reset();
});

test('Move Piece Left', () => {
    const board = new Board();
    const tPiece = allPieces[6];

    expect(tPiece.offset).toEqual([0, 3]);

    expect(tPiece.moveLeft(board)).toBe(true);

    expect(tPiece.offset).toEqual([0, 2]);

    board.GameBoard[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[2] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[3] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[4] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];

    expect(tPiece.moveLeft(board)).toBe(false);

    expect(tPiece.offset).toEqual([0, 2]);

    tPiece.reset();
});

test('Move Piece Right', () => {
    const board = new Board();
    const tPiece = allPieces[6];

    expect(tPiece.offset).toEqual([0, 3]);

    expect(tPiece.moveRight(board)).toBe(true);

    expect(tPiece.offset).toEqual([0, 4]);

    board.GameBoard[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[2] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[3] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    board.GameBoard[4] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];

    expect(tPiece.moveRight(board)).toBe(false);

    expect(tPiece.offset).toEqual([0, 4]);

    tPiece.reset();
});

test('Get Wall Kicks', () => {
    const iPiece = allPieces[0];
    const oPiece = allPieces[3];
    const tPiece = allPieces[6];

    expect(oPiece.getWallKicks(true, false)).toEqual([[0, 0]]);
    expect(iPiece.getWallKicks(true, false)).toEqual([
        [0, 0],
        [-2, 0],
        [1, 0],
        [-2, -1],
        [1, 2]
    ]);
    expect(tPiece.getWallKicks(true, false)).toEqual([
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2]
    ]);
    expect(tPiece.getWallKicks(false, false)).toEqual([
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2]
    ]);

    tPiece.currentRotation = 2;

    expect(tPiece.getWallKicks(false, false)).toEqual([
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2]
    ]);

    iPiece.currentRotation = 3;

    expect(iPiece.getWallKicks(true, false)).toEqual([
        [0, 0],
        [1, 0],
        [-2, 0],
        [1, -2],
        [-2, 1]
    ]);

    iPiece.reset();
    tPiece.reset();
    oPiece.reset();
});

test('Get Correct Wall Kick', () => {
    const board = new Board();

    const iPiece = allPieces[0];
    const oPiece = allPieces[3];
    const tPiece = allPieces[6];

    expect(iPiece.getCorrectWallKick(board, 1, true, false)).toEqual([0, 0]);
    expect(oPiece.getCorrectWallKick(board, 1, true, false)).toEqual([0, 0]);
    expect(tPiece.getCorrectWallKick(board, 1, true, false)).toEqual([0, 0]);

    board.GameBoard[0] = [0, 2, 4, 0, 0, 3, 3, 2, 0, 1];
    board.GameBoard[1] = [0, 2, 4, 0, 0, 3, 3, 2, 0, 1];
    board.GameBoard[2] = [0, 2, 4, 0, 0, 3, 3, 2, 0, 1];

    expect(iPiece.getCorrectWallKick(board, 1, true, false)).toEqual([-2, 0]);

    board.GameBoard[0] = [1, 2, 4, 1, 1, 3, 3, 2, 1, 1];
    board.GameBoard[1] = [1, 2, 4, 1, 1, 3, 3, 2, 1, 1];
    board.GameBoard[2] = [1, 2, 4, 1, 1, 3, 3, 2, 1, 1];

    expect(tPiece.getCorrectWallKick(board, 1, true, false)).toEqual(null);
});

test('Get Shadow Piece Coordinates', () => {
    const board = new Board();

    const iPiece = allPieces[0];

    expect(iPiece.getShadowCoordinates(board)).toEqual([
        [21, 3],
        [21, 4],
        [21, 5],
        [21, 6]
    ]);

    iPiece.offset = [4, 6];
    iPiece.currentRotation = 1;

    expect(iPiece.getShadowCoordinates(board)).toEqual([
        [18, 8],
        [19, 8],
        [20, 8],
        [21, 8]
    ]);
});
