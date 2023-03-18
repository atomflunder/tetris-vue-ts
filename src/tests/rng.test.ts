import { MODERN_PIECE_RNG, PIECE_BAG_AMOUNT } from '@/helpers/consts';
import { getRandomPiece } from '@/helpers/rng';
import { expect, test } from 'vitest';

test('Get Random Piece', () => {
    if (MODERN_PIECE_RNG) {
        expect(getRandomPiece([], 3, true).length).toBe(PIECE_BAG_AMOUNT * 7);
    } else {
        expect(getRandomPiece([], 3, true).length).toBe(15);
    }
});
