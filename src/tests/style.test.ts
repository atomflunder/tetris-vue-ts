import { Game } from '@/helpers/game';
import { getColorClass, getHeldPieceColor, getGlow } from '@/helpers/style';
import { expect, test } from 'vitest';

test('Get Color Class', () => {
    const game = new Game();

    expect(getColorClass(game, 1, 0, 0)).toBe('i block');
    expect(getColorClass(game, 2, 0, 0)).toBe('j block');
    expect(getColorClass(game, 3, 0, 0)).toBe('l block');
    expect(getColorClass(game, 4, 0, 0)).toBe('o block');
    expect(getColorClass(game, 5, 0, 0)).toBe('s block');
    expect(getColorClass(game, 6, 0, 0)).toBe('z block');
    expect(getColorClass(game, 7, 0, 0)).toBe('t block');
    expect(getColorClass(game, 8, 0, 0)).toBe('greyed-out block');
    expect(getColorClass(game, 0, 0, 0)).toBe('empty block');
});

test('Get Held Piece Color', () => {
    const game = new Game();

    expect(getHeldPieceColor(game, 1)).toBe('i block small-block');

    game.holdThisTurn = false;

    expect(getHeldPieceColor(game, 1)).toBe('greyed-out empty small-block');
});

test('Is in Danger', () => {
    const game = new Game();

    expect(getGlow(game)).toBe('');

    game.board.GameBoard[2][2] = 2;

    expect(getGlow(game)).toBe('red-glow ');

    game.isPaused = true;

    expect(getGlow(game)).toBe('purple-glow ');

    game.board.GameBoard[2][2] = 0;

    expect(getGlow(game)).toBe('blue-glow ');
});
