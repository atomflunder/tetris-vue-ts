import { Board } from '@/helpers/board';
import { allPieces } from '@/helpers/pieceData';
import { expect, test } from 'vitest';

test('New Board', () => {
    const newBoard = new Board();

    expect(newBoard.GameBoard.length).toBe(22);
    expect(newBoard.GameBoard[0].length).toBe(10);
});

test('Full Lines', () => {
    const newBoard = new Board();

    newBoard.GameBoard[10] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    newBoard.GameBoard[13] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    newBoard.GameBoard[16] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    newBoard.GameBoard[20] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    expect(newBoard.getFullLines()).toEqual([10, 13, 16]);
});

test('Delete Line', () => {
    const newBoard = new Board();

    newBoard.GameBoard[10] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    newBoard.GameBoard[13] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    newBoard.GameBoard[16] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    newBoard.GameBoard[20] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    newBoard.deleteLine(10);

    expect(newBoard.GameBoard[10]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(newBoard.getFullLines()).toEqual([13, 16]);
});

test('Insert Garbage Lines', () => {
    const newBoard = new Board();
    const currentPiece = allPieces[0];
    currentPiece.offset = [2, 5];

    newBoard.insertGarbageLines(3, currentPiece);
    const result21 = newBoard.GameBoard[21].reduce((a, b) => a + b);
    const result20 = newBoard.GameBoard[20].reduce((a, b) => a + b);
    const result19 = newBoard.GameBoard[19].reduce((a, b) => a + b);

    expect(currentPiece.offset).toEqual([0, 5]);
    expect(result21).toEqual(72);
    expect(result20).toEqual(72);
    expect(result19).toEqual(72);
});

test('First Rows Empty', () => {
    const newBoard = new Board();
    const currentPiece = allPieces[0];

    expect(newBoard.firstRowsNotEmpty(currentPiece, 22)).toBe(false);

    newBoard.GameBoard[3] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    expect(newBoard.firstRowsNotEmpty(currentPiece, 5)).toBe(true);
});
