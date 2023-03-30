import lineClear from '@/assets/sounds/lineClear.wav';
import move from '@/assets/sounds/move.wav';
import rotate from '@/assets/sounds/rotate.wav';
import { CONFIG } from './config';

const lineClearSound = new Audio(lineClear);
const moveSound = new Audio(move);
const rotateSound = new Audio(rotate);

export const playSound = (type: string): void => {
    // TODO: Add line clear sound effects for:
    // - Single/Double/Triple/Tetris clears
    // - New Move Effect
    // - New Rotate Effect
    // - Hard Drops
    // - When a piece locks
    // - T Spins ?
    // - Game Over
    // - Game Start
    // Use: https://sfxr.me/

    switch (type) {
        case 'lineClear':
            lineClearSound.volume = CONFIG.VOLUME;
            lineClearSound.play();
            break;
        case 'move':
            moveSound.volume = CONFIG.VOLUME;
            moveSound.play();
            break;
        case 'rotate':
            rotateSound.volume = CONFIG.VOLUME;
            rotateSound.play();
            break;
    }
};
