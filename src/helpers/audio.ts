import { CONFIG } from './config';

// TODO: This can probably be cleaned up.

import double from '@/assets/sounds/double.mp3';
import gameFinished from '@/assets/sounds/gameFinished.mp3';
import gameOver from '@/assets/sounds/gameOver.mp3';
import gamePause from '@/assets/sounds/gamePause.mp3';
import gameStart from '@/assets/sounds/gameStart.mp3';
import gameUnpause from '@/assets/sounds/gameUnpause.mp3';
import garbage from '@/assets/sounds/garbage.mp3';
import hardDrop from '@/assets/sounds/hardDrop.mp3';
import holdPiece from '@/assets/sounds/holdPiece.mp3';
import levelUp from '@/assets/sounds/levelUp.mp3';
import lock from '@/assets/sounds/lock.mp3';
import move from '@/assets/sounds/move.mp3';
import rotate from '@/assets/sounds/rotate.mp3';
import single from '@/assets/sounds/single.mp3';
import tetris from '@/assets/sounds/tetris.mp3';
import triple from '@/assets/sounds/triple.mp3';
import tSpinFull from '@/assets/sounds/tSpinFull.mp3';
import tSpinMini from '@/assets/sounds/tSpinMini.mp3';

const hardDropSound = new Audio(hardDrop);
const moveSound = new Audio(move);
const rotateSound = new Audio(rotate);
const lockSound = new Audio(lock);
const singleSound = new Audio(single);
const doubleSound = new Audio(double);
const tripleSound = new Audio(triple);
const tetrisSound = new Audio(tetris);
const tSpinFullSound = new Audio(tSpinFull);
const tSpinMiniSound = new Audio(tSpinMini);
const garbageSound = new Audio(garbage);
const gamePauseSound = new Audio(gamePause);
const gameUnpauseSound = new Audio(gameUnpause);
const gameStartSound = new Audio(gameStart);
const gameOverSound = new Audio(gameOver);
const gameFinishedSound = new Audio(gameFinished);
const levelUpSound = new Audio(levelUp);
const holdPieceSound = new Audio(holdPiece);

/**
 * Plays a sound for a specific action.
 */
export const playSound = (action: string): void => {
    let sound: HTMLAudioElement;

    switch (action) {
        case 'move':
            sound = moveSound;
            break;
        case 'rotate':
            sound = rotateSound;
            break;
        case 'hardDrop':
            sound = hardDropSound;
            break;
        case 'lock':
            sound = lockSound;
            break;
        case 'lineclear-1':
            sound = singleSound;
            break;
        case 'lineclear-2':
            sound = doubleSound;
            break;
        case 'lineclear-3':
            sound = tripleSound;
            break;
        case 'lineclear-4':
            sound = tetrisSound;
            break;
        case 'tSpinFull':
            sound = tSpinFullSound;
            break;
        case 'tSpinMini':
            sound = tSpinMiniSound;
            break;
        case 'garbage':
            sound = garbageSound;
            break;
        case 'gamePause':
            sound = gamePauseSound;
            break;
        case 'gameUnpause':
            sound = gameUnpauseSound;
            break;
        case 'gameStart':
            sound = gameStartSound;
            break;
        case 'gameOver':
            sound = gameOverSound;
            break;
        case 'gameFinished':
            sound = gameFinishedSound;
            break;
        case 'levelUp':
            sound = levelUpSound;
            break;
        case 'holdPiece':
            sound = holdPieceSound;
            break;
        default:
            sound = new Audio();
    }

    const cloneSound = sound.cloneNode();
    // Not sure why TypeScript spits out a propery error here, it works fine.
    // @ts-ignore
    cloneSound.volume = CONFIG.VOLUME;
    // @ts-ignore
    cloneSound.play();
};
