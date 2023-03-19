import { MODERN_PIECE_RNG, PIECE_LOCK_TICKS } from '@/helpers/consts';
import { Game, TSpin } from '@/helpers/game';
import { expect, test } from 'vitest';

test('New Game', () => {
    const game = new Game();

    expect(game.gameOver).toBe(false);
    expect(game.isPaused).toBe(false);

    // The board is already tested separately,
    // so no need to repeat that here.

    if (MODERN_PIECE_RNG) {
        expect(game.nextPieces.length).toBe(13);
    } else {
        expect(game.nextPieces.length).toBe(15);
    }

    const sumPieceCounter = game.pieceCounter.reduce((a, b) => a + b);
    expect(sumPieceCounter).toBe(1);

    expect(game.holdPiece).toBe(null);
    expect(game.holdThisTurn).toBe(true);
    expect(game.currentDrop).toBe(0);
    expect(game.score).toBe(0);
    expect(game.totalLines).toBe(0);
    expect(game.lineCounter).toEqual([0, 0, 0, 0]);
    expect(game.level).toEqual(1);
    expect(game.ticks).toBe(0);
    expect(game.lockTick).toBe(PIECE_LOCK_TICKS);
    expect(game.waitForLock).toBe(false);
});

test('Advance Tick', () => {
    const game1 = new Game();
    game1.gameOver = true;

    expect(game1.ticks).toBe(0);

    game1.advanceTick();

    expect(game1.ticks).toBe(0);

    const game2 = new Game();
    game2.isPaused = true;

    expect(game2.ticks).toBe(0);

    game2.advanceTick();

    expect(game2.ticks).toBe(0);
});

test('Move Down', () => {
    const game = new Game();

    expect(game.currentPiece.offset).toEqual([0, 3]);

    game.moveDown(false, true);

    expect(game.currentPiece.offset).toEqual([1, 3]);

    game.moveDown(true, true);

    // The game will roll over into the next turn if you hard drop.
    expect(game.currentPiece.offset).toEqual([0, 3]);
    expect(game.score).toBe(40);
});

test('Next Turn', () => {
    const gameGO = new Game();
    // We are spawning a piece on top of another piece instantly,
    // which is a game over.
    gameGO.nextTurn();
    expect(gameGO.gameOver).toBe(true);

    const game = new Game();

    game.ticks = 10;

    game.currentPiece.offset = [19, 3];
    game.board.GameBoard[10] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    game.board.GameBoard[11] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    game.board.GameBoard[12] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    game.board.GameBoard[13] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];

    game.nextTurn();

    expect(game.score).toBe(800);
    expect(game.board.GameBoard[10]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(game.totalLines).toBe(4);
    expect(game.lineCounter).toEqual([0, 0, 0, 1]);
    expect(game.pieceCounter.reduce((a, b) => a + b)).toEqual(2);
    expect(game.ticks).toBe(0);
    expect(game.holdThisTurn).toBe(true);
    expect(game.waitForLock).toBe(false);
});

test('Toggle Hold Piece', () => {
    const game = new Game();

    expect(game.holdPiece).toBeFalsy();

    game.ticks = 10;

    const toggle = game.toggleHoldPiece();
    const toggleAgain = game.toggleHoldPiece();

    expect(toggle).toBe(true);
    expect(toggleAgain).toBe(false);

    expect(game.holdPiece).toBeTruthy();

    expect(game.ticks).toBe(0);
    expect(game.waitForLock).toBe(false);
});

test('Get Score', () => {
    const game = new Game();

    expect(game.getScore(1, 1)).toBe(100);
    expect(game.getScore(2, 1)).toBe(300);
    expect(game.getScore(3, 1)).toBe(500);
    expect(game.getScore(4, 1)).toBe(800);

    expect(game.getScore(1, 20)).toBe(2000);
    expect(game.getScore(2, 20)).toBe(6000);
    expect(game.getScore(3, 20)).toBe(10000);
    expect(game.getScore(4, 20)).toBe(16000);

    expect(game.getScore(1, 20, TSpin.Full, true)).toBe(16000);
    expect(game.getScore(2, 30, TSpin.Mini)).toBe(12000);
    expect(game.getScore(3, 20, TSpin.None, true)).toBe(36000);

    expect(game.getScore(4, 30, TSpin.None, false)).toBe(24000);
});

test('Get Fall Speed', () => {
    const game = new Game();

    expect(game.getFallSpeed()).toBe(48);

    game.level = 5;

    expect(game.getFallSpeed()).toBe(28);

    game.level = 15;

    expect(game.getFallSpeed()).toBe(4);

    game.level = 31;

    expect(game.getFallSpeed()).toBe(1);
});

test('Increment Piece Count', () => {
    const game = new Game();

    expect(game.pieceCounter.reduce((a, b) => a + b)).toBe(1);

    game.nextTurn();

    expect(game.pieceCounter.reduce((a, b) => a + b)).toBe(2);
});
