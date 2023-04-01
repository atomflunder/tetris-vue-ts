import { CONFIG } from '@/helpers/config';
import { getRandomPiece, getRandomPieceClassic, getRandomPieceModern } from '@/helpers/rng';
import { expect, test } from 'vitest';

test('Get Random Piece', () => {
    if (CONFIG.MODERN_PIECE_RNG.value) {
        expect(getRandomPiece([], 3, true).length).toBe(21);
    } else {
        expect(getRandomPiece([], 3, true).length).toBe(15);
    }

    expect(getRandomPieceModern([], 3, true).length).toBe(21);
    expect(getRandomPieceClassic([]).length).toBe(15);
});
