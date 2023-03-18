import { MODERN_PIECE_RNG } from '@/helpers/consts';
import { getRandomPiece } from '@/helpers/rng';
import { expect, test } from 'vitest';

test('Get Random Piece', () => {
    if (MODERN_PIECE_RNG) {
        expect(getRandomPiece([], 3, true).length).toBe(21);
    } else {
        expect(getRandomPiece([], 3, true).length).toBe(15);
    }
});
