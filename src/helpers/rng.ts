import { allPieces, resetPiece, type Piece } from './pieces';

export const getRandomPiece = (): Piece => {
    const pieces = allPieces.slice();

    const p = pieces[Math.floor(Math.random() * pieces.length)];

    resetPiece(p);

    return p;
};
