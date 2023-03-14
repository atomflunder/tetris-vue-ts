import { allPieces } from './pieceData';
import type { Piece } from './pieces';

/**
 * Gets a truly random piece, like in classic versions of Tetris.
 */
export const getRandomPieceClassic = (nextPieces: Piece[]): Piece[] => {
    // We have to have at least 14 pieces in the next piece queue, for displaying them all.
    // So we fill it up to this point.
    while (nextPieces.length <= 14) {
        const pieces = allPieces.slice();

        const p = pieces[Math.floor(Math.random() * pieces.length)];

        nextPieces.push(p);
    }

    return nextPieces;
};

/**
 * Gets you a pseudo-random shuffled piece bag, like in modern Tetris versions.
 */
export const getRandomPieceModern = (nextPieces: Piece[], pieceBagSize: number): Piece[] => {
    // We have to have at least 14 pieces in the next piece queue, for displaying them all.
    // If we do already have those we just return.
    if (nextPieces.length > 14) {
        return nextPieces;
    }

    // Otherwise we will push the next 7 * (Piece Bag Size) pieces onto the next piece queue.
    let pieceBag = [];

    for (let i = 0; i < pieceBagSize; i++) {
        pieceBag.push(...allPieces.slice());
    }

    // From: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle(a: Array<any>) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    pieceBag = shuffle(pieceBag);

    nextPieces.push(...pieceBag);

    return nextPieces;
};
