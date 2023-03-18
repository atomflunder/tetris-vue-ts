import { allPieces, getDefaultPiece, getPreviewPieceTable } from '@/helpers/pieceData';
import { expect, test } from 'vitest';

test('All Pieces', () => {
    const pieces = allPieces;

    expect(pieces.length).toBe(7);
    expect(pieces[0].name).toBe('I');
    expect(pieces[1].name).toBe('J');
    expect(pieces[2].name).toBe('L');
    expect(pieces[3].name).toBe('O');
    expect(pieces[4].name).toBe('S');
    expect(pieces[5].name).toBe('Z');
    expect(pieces[6].name).toBe('T');

    expect(pieces[0].color).toBe(1);
    expect(pieces[1].color).toBe(2);
    expect(pieces[2].color).toBe(3);
    expect(pieces[3].color).toBe(4);
    expect(pieces[4].color).toBe(5);
    expect(pieces[5].color).toBe(6);
    expect(pieces[6].color).toBe(7);
});

test('Get default Piece', () => {
    expect(getDefaultPiece('I')).toEqual([
        [0, 0, 0, 0],
        [1, 1, 1, 1]
    ]);
    expect(getDefaultPiece('L')).toEqual([
        [0, 0, 3, 0],
        [3, 3, 3, 0]
    ]);
    expect(getDefaultPiece('J')).toEqual([
        [2, 0, 0, 0],
        [2, 2, 2, 0]
    ]);
    expect(getDefaultPiece('O')).toEqual([
        [0, 4, 4, 0],
        [0, 4, 4, 0]
    ]);
    expect(getDefaultPiece('S')).toEqual([
        [0, 5, 5, 0],
        [5, 5, 0, 0]
    ]);
    expect(getDefaultPiece('Z')).toEqual([
        [6, 6, 0, 0],
        [0, 6, 6, 0]
    ]);
    expect(getDefaultPiece('T')).toEqual([
        [0, 7, 0, 0],
        [7, 7, 7, 0]
    ]);
    expect(getDefaultPiece(null)).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);
});

test('Get Preview Piece Table', () => {
    expect(getPreviewPieceTable(allPieces)).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 3, 0],
        [3, 3, 3, 0],
        [0, 0, 0, 0],
        [0, 4, 4, 0],
        [0, 4, 4, 0],
        [0, 0, 0, 0],
        [0, 5, 5, 0],
        [5, 5, 0, 0],
        [0, 0, 0, 0],
        [6, 6, 0, 0],
        [0, 6, 6, 0],
        [0, 0, 0, 0],
        [0, 7, 0, 0],
        [7, 7, 7, 0],
        [0, 0, 0, 0]
    ]);
});
