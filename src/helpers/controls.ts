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
    PAUSE_GAME: getKeybind('PAUSE_GAME', 'Escape'),
    RESET_GAME: getKeybind('RESET_GAME', 'Enter'),
    BACK_TO_MENU: getKeybind('BACK_TO_MENU', 'Escape'),

    MOVE_LEFT: getKeybind('MOVE_LEFT', 'ArrowLeft'),
    MOVE_RIGHT: getKeybind('MOVE_RIGHT', 'ArrowRight'),
    SOFT_DROP: getKeybind('SOFT_DROP', 'ArrowDown'),
    HARD_DROP: getKeybind('HARD_DROP', 'ArrowUp'),

    ROTATE_CW: getKeybind('ROTATE_CW', ' '),
    ROTATE_CCW: getKeybind('ROTATE_CCW', 'Enter'),

    HOLD_PIECE: getKeybind('HOLD_PIECE', '0'),

    INSERT_GARBAGE: getKeybind('INSERT_GARBAGE', 'F1')
};

/**
 * Handles the keyboard inputs.
 */
export const handleInput = (e: KeyboardEvent, game: Game): void => {
    if (game.gameOver || game.gameFinished) {
        return;
    }

    // We need a special case for Esc
    // Because we don't want to listen to any other events while the game is paused.
    if (e.key === CONTROLS.PAUSE_GAME) {
        game.isPaused = !game.isPaused;
    }

    if (game.isPaused) {
        return;
    }

    // When an action successfully completes, we update the lock ticks and the shadow piece coordinates.
    const update = (): void => {
        game.lockTick = CONFIG.PIECE_LOCK_TICKS;
        game.shadowPiece = game.currentPiece.getShadowPieceCoordinates(game.board);

        if (game.waitForLock) {
            game.lockMoveResets--;
            if (game.lockMoveResets === 0) {
                game.lockTick = 0;
            }
        }
    };

    // Calls the associated function every X milliseconds, after a Y milliseconds delay.
    const handleDAS = (fn: () => void): void => {
        // Also we call it once, immediately.
        fn();

        let begin: number | null = CONFIG.DAS_DELAY;
        const speed = CONFIG.ARR_SPEED;

        const dasLoop = () => {
            game.keyEvents[e.key] = setTimeout(() => {
                // Then we set the beginning to null in order to call the function with the speed variable.
                begin = null;

                if (!game.gameOver) {
                    dasLoop();
                }

                fn();
            }, begin || speed);
        };

        dasLoop();
    };

    // TODO: Fix holding left+right spazz out

    const moveLeftFn = () => {
        if (game.currentPiece.moveLeft(game.board)) {
            update();
            game.lastMove = Move.Left;
        }
    };

    const moveRightFn = () => {
        if (game.currentPiece.moveRight(game.board)) {
            update();
            game.lastMove = Move.Right;
        }
    };

    const moveDownFn = () => {
        game.moveDown(false, true);
        // Incrementing the drop counter for every time the game registers a consecutive down press.
        game.currentDrop += 1;
        // When you hold down you probably do want the piece to lock instantly.
        game.lockTick = 0;
    };

    switch (e.key) {
        case CONTROLS.MOVE_LEFT:
            // If we are holding down the key anyways, we do not want to fire game event again.
            if (game.keyEvents[e.key]) {
                return;
            }

            handleDAS(moveLeftFn);

            break;
        case CONTROLS.MOVE_RIGHT:
            if (game.keyEvents[e.key]) {
                return;
            }

            handleDAS(moveRightFn);

            break;
        case CONTROLS.SOFT_DROP:
            if (game.keyEvents[e.key]) {
                return;
            }

            handleDAS(moveDownFn);

            break;
        case CONTROLS.HARD_DROP:
            game.moveDown(true, true);
            break;
        case CONTROLS.ROTATE_CW:
            if (game.currentPiece.rotate(game.board, true)) {
                update();
                game.lastMove = Move.Rotation;
            }
            break;
        case CONTROLS.ROTATE_CCW:
            if (game.currentPiece.rotate(game.board, false)) {
                update();
                game.lastMove = Move.Rotation;
            }
            break;
        case CONTROLS.HOLD_PIECE:
            if (game.toggleHoldPiece()) {
                update();
            }
            break;
        case CONTROLS.INSERT_GARBAGE:
            game.board.insertGarbageLines(2, game.currentPiece);
            update();
            break;
    }
};

/**
 * Handles the event when the user releases a key.
 */
export const handleKeyup = (e: KeyboardEvent, game: Game): void => {
    if (e.key === CONTROLS.MOVE_LEFT || e.key === CONTROLS.MOVE_RIGHT || CONTROLS.SOFT_DROP) {
        clearTimeout(game.keyEvents[e.key]!);
        game.keyEvents[e.key] = null;
    }

    // Also resetting the down counter when the player releases the down key.
    if (e.key === CONTROLS.SOFT_DROP) {
        game.currentDrop = 0;
        game.lockTick = CONFIG.PIECE_LOCK_TICKS;
    }
};
