import { CONFIG } from './config';
import type { Game } from './game';
import { Move } from './types';

/**
 * Gets a keybind setting from local storage.
 */
export const getKeybind = (keybind: string, defaultValue: string): string => {
    const k = localStorage.getItem(`controls-${keybind}`);
    if (k === null) {
        return defaultValue;
    }
    return k;
};

/**
 * Sets a keybing setting to local storage.
 */
export const setKeybind = (keybind: string, value: string): void => {
    CONTROLS[keybind as keyof typeof CONTROLS].value = value;

    localStorage.setItem(`controls-${keybind}`, value);
};

/**
 * The control scheme.
 * If a keybind is not used we use a default keybinding.
 *
 * For the values corresponding to the keys, please see:
 * https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 */
export const CONTROLS = {
    PAUSE_GAME: {
        name: 'PAUSE_GAME',
        defaultValue: 'Escape',
        value: getKeybind('PAUSE_GAME', 'Escape')
    },
    RESET_GAME: {
        name: 'RESET_GAME',
        defaultValue: 'Enter',
        value: getKeybind('RESET_GAME', 'Enter')
    },
    BACK_TO_MENU: {
        name: 'BACK_TO_MENU',
        defaultValue: 'Escape',
        value: getKeybind('BACK_TO_MENU', 'Escape')
    },

    MOVE_LEFT: {
        name: 'MOVE_LEFT',
        defaultValue: 'ArrowLeft',
        value: getKeybind('MOVE_LEFT', 'ArrowLeft')
    },
    MOVE_RIGHT: {
        name: 'MOVE_RIGHT',
        defaultValue: 'ArrowRight',
        value: getKeybind('MOVE_RIGHT', 'ArrowRight')
    },
    SOFT_DROP: {
        name: 'SOFT_DROP',
        defaultValue: 'ArrowDown',
        value: getKeybind('SOFT_DROP', 'ArrowDown')
    },
    HARD_DROP: {
        name: 'HARD_DROP',
        defaultValue: 'ArrowUp',
        value: getKeybind('HARD_DROP', 'ArrowUp')
    },

    ROTATE_CW: {
        name: 'ROTATE_CW',
        defaultValue: ' ',
        value: getKeybind('ROTATE_CW', ' ')
    },
    ROTATE_CCW: {
        name: 'ROTATE_CCW',
        defaultValue: 'Enter',
        value: getKeybind('ROTATE_CCW', 'Enter')
    },
    ROTATE_180: {
        name: 'ROTATE_180',
        defaultValue: 'A',
        value: getKeybind('ROTATE_180', 'A')
    },

    HOLD_PIECE: {
        name: 'HOLD_PIECE',
        defaultValue: '0',
        value: getKeybind('HOLD_PIECE', '0')
    },

    INSERT_GARBAGE: {
        name: 'INSERT_GARBAGE',
        defaultValue: 'F1',
        value: getKeybind('INSERT_GARBAGE', 'F1')
    }
};

/**
 * Handles the keyboard inputs.
 */
export const handleInput = (e: KeyboardEvent, game: Game): void => {
    // If the game is over we don't want to listen to any events.
    if (game.over || game.finished) {
        return;
    }

    // We also don't want to listen to any other events while the game is paused.
    if (e.key === CONTROLS.PAUSE_GAME.value) {
        if (game.paused) {
            game.paused = false;
            game.audioPlayer.playSound('gameUnpause');
        } else {
            game.paused = true;
            game.audioPlayer.playSound('gamePause');
        }
    }

    if (game.paused) {
        return;
    }

    // When an action successfully completes, we update the lock ticks and the shadow piece coordinates.
    const update = (): void => {
        game.lockTicksRemaining = CONFIG.PIECE_LOCK_TICKS.value;
        game.shadowPiece = game.currentPiece.getShadowCoordinates(game.board);

        if (game.waitForLock) {
            game.lockMoveResets--;
            if (game.lockMoveResets === 0) {
                game.lockTicksRemaining = 0;
            }
        }
    };

    // Calls the associated function every X milliseconds, after a Y milliseconds delay.
    const handleDAS = (fn: () => void): void => {
        // Also we call it once, immediately.
        if (!game.frozen) {
            fn();
        }

        let begin: number | null = CONFIG.DAS_DELAY.value;
        const speed = CONFIG.ARR_SPEED.value;

        const dasLoop = () => {
            game.keyEvents[e.key] = setTimeout(() => {
                // Then we set the beginning to null in order to call the function with the speed variable.
                begin = null;

                if (!game.over) {
                    dasLoop();
                }

                // If the game is frozen we don't want to execute the function just yet.
                if (!game.frozen) {
                    fn();
                }
            }, begin || speed);
        };

        dasLoop();
    };

    const moveLeftFn = () => {
        if (game.currentPiece.moveLeft(game.board)) {
            update();
            game.lastMove = Move.Left;
            game.audioPlayer.playSound('move');
        }
    };

    const moveRightFn = () => {
        if (game.currentPiece.moveRight(game.board)) {
            update();
            game.lastMove = Move.Right;
            game.audioPlayer.playSound('move');
        }
    };

    const moveDownFn = () => {
        game.moveDown(false, true);
        // Incrementing the drop counter for every time the game registers a consecutive down press.
        game.currentDrop += 1;
        // When you hold down you probably do want the piece to lock instantly.
        game.lockTicksRemaining = 0;
        game.audioPlayer.playSound('move');
    };

    switch (e.key) {
        case CONTROLS.MOVE_LEFT.value:
            // If we are holding down the key anyways, we do not want to fire game event again.
            if (game.keyEvents[e.key]) {
                return;
            }

            // We also need to clear the event from the opposite direction,
            // if the user happens to press both keys at once.
            clearTimeout(game.keyEvents[CONTROLS.MOVE_RIGHT.value]!);
            game.keyEvents[CONTROLS.MOVE_RIGHT.value] = null;
            handleDAS(moveLeftFn);

            break;
        case CONTROLS.MOVE_RIGHT.value:
            if (game.keyEvents[e.key]) {
                return;
            }

            clearTimeout(game.keyEvents[CONTROLS.MOVE_LEFT.value]!);
            game.keyEvents[CONTROLS.MOVE_LEFT.value] = null;
            handleDAS(moveRightFn);

            break;
        case CONTROLS.SOFT_DROP.value:
            if (game.keyEvents[e.key]) {
                return;
            }

            handleDAS(moveDownFn);

            break;
        case CONTROLS.HARD_DROP.value:
            game.moveDown(true, true);
            game.audioPlayer.playSound('hardDrop');
            break;
        case CONTROLS.ROTATE_CW.value:
            // We don't want users to rotate a piece while it is frozen.
            // This could lead to the piece not being in the full line anymore.
            // We still want to listen to the input for moving a piece left/right
            // since this is needed to buffer DAS.
            // The check is not needed for Hard/Soft Drops as you will not be able
            // to move a piece down any more when a line gets cleared.
            if (game.frozen) {
                return;
            }

            if (game.currentPiece.rotate(game.board, true, false)) {
                update();
                game.lastMove = Move.Rotation;
                game.audioPlayer.playSound('rotate');
            }
            break;
        case CONTROLS.ROTATE_CCW.value:
            if (game.frozen) {
                return;
            }

            if (game.currentPiece.rotate(game.board, false, false)) {
                update();
                game.lastMove = Move.Rotation;
                game.audioPlayer.playSound('rotate');
            }
            break;
        case CONTROLS.ROTATE_180.value:
            if (game.frozen) {
                return;
            }

            if (game.currentPiece.rotate(game.board, true, true)) {
                update();
                game.lastMove = Move.Rotation;
                game.audioPlayer.playSound('rotate');
            }
            break;
        case CONTROLS.HOLD_PIECE.value:
            if (game.frozen) {
                return;
            }

            if (game.toggleHoldPiece()) {
                update();
            }
            break;
        case CONTROLS.INSERT_GARBAGE.value:
            if (game.frozen) {
                return;
            }

            game.board.insertGarbageLines(2, game.currentPiece);
            update();
            game.audioPlayer.playSound('garbage');
            break;
    }
};

/**
 * Handles the event when the user releases a key.
 */
export const handleKeyup = (e: KeyboardEvent, game: Game): void => {
    if (
        e.key === CONTROLS.MOVE_LEFT.value ||
        e.key === CONTROLS.MOVE_RIGHT.value ||
        e.key === CONTROLS.SOFT_DROP.value
    ) {
        clearTimeout(game.keyEvents[e.key]!);
        game.keyEvents[e.key] = null;
    }

    // Also resetting the down counter when the player releases the down key.
    if (e.key === CONTROLS.SOFT_DROP.value) {
        game.currentDrop = 0;
        game.lockTicksRemaining = CONFIG.PIECE_LOCK_TICKS.value;
    }
};
