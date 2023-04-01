import { CONFIG } from './config';
import type { SoundFiles } from './types';

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

export class AudioPlayer {
    soundFiles: SoundFiles;

    constructor() {
        const soundImports = [
            {
                name: 'lineclear-2',
                sound: double
            },
            {
                name: 'gameFinished',
                sound: gameFinished
            },
            {
                name: 'gameOver',
                sound: gameOver
            },
            {
                name: 'gamePause',
                sound: gamePause
            },
            {
                name: 'gameStart',
                sound: gameStart
            },
            {
                name: 'gameUnpause',
                sound: gameUnpause
            },

            {
                name: 'garbage',
                sound: garbage
            },
            {
                name: 'hardDrop',
                sound: hardDrop
            },
            {
                name: 'holdPiece',
                sound: holdPiece
            },
            {
                name: 'levelUp',
                sound: levelUp
            },
            {
                name: 'lock',
                sound: lock
            },
            {
                name: 'move',
                sound: move
            },
            {
                name: 'rotate',
                sound: rotate
            },
            {
                name: 'lineclear-1',
                sound: single
            },
            {
                name: 'lineclear-4',
                sound: tetris
            },
            {
                name: 'lineclear-3',
                sound: triple
            },
            {
                name: 'tSpinFull',
                sound: tSpinFull
            },
            {
                name: 'tSpinMini',
                sound: tSpinMini
            }
        ];

        this.soundFiles = {};

        for (let i = 0; i < soundImports.length; i++) {
            this.soundFiles[soundImports[i].name] = new Audio(soundImports[i].sound);
        }
    }

    /**
     * Plays a sound for a specific action.
     */
    playSound = (action: string): void => {
        const sound = this.soundFiles[action];

        const cloneSound = sound.cloneNode() as HTMLAudioElement;

        cloneSound.volume = CONFIG.VOLUME.value;
        cloneSound.play();
    };
}
