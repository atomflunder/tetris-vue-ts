import { AudioPlayer } from './audio';
import { Board } from './board';
import { CONFIG } from './config';
import type { Piece } from './pieces';
import { getRandomPiece } from './rng';
import { setHighScore } from './score';
import { incrementLifetimeStats } from './stats';
import { Timer } from './timer';
import { Menu, Move, TSpin, type KeyEvents } from './types';

export class Game {
    mode: Menu;

    // Game Over is used when you "fail".
    over: boolean;
    // And Game Finished is used when you complete one of the challenge modes.
    finished: boolean;
    paused: boolean;
    // For delays like line-clear delay, or maybe Pause Countdowns in the future.
    frozen: boolean;

    maxTime: number | null;
    maxLines: number | null;

    board: Board;
    currentPiece: Piece;
    nextPieces: Piece[];
    // The individual count of each piece.
    pieceCountList: number[];

    // The coordinates of the "shadow" piece.
    shadowPiece: number[][];
    holdPiece: Piece | null;
    // You can only toggle held pieces once per turn.
    canHold: boolean;

    lastMove: Move;

    backToBack: number;
    currentCombo: number;

    // We need to keep track of how long the player is holding down in a row.
    currentDrop: number;

    score: number;
    lineCount: number;
    // The specific line clears (Single, Double, Triple, Tetris)
    lineCountList: number[];
    level: number;
    // The number of Mini and Full T-Spins
    tSpinCountList: number[];

    // A tick is 1/60th of a second.
    ticks: number;
    // Just a timer that gets displayed.
    timer: Timer;

    // The amount of ticks after a piece gets locked without input.
    lockTicksRemaining: number;
    waitForLock: boolean;
    lockMoveResets: number;

    // For the DAS.
    keyEvents: KeyEvents;

    audioPlayer: AudioPlayer;

    constructor(
        gameMode: Menu = Menu.Endless,
        maxLines: number | null = null,
        maxTime: number | null = null,
        startLevel: number = 1
    ) {
        const nextPieces = getRandomPiece([], CONFIG.PIECE_BAG_AMOUNT.value, true);

        // Taking the first piece of the queue.
        const currentPiece = nextPieces[0];
        currentPiece.reset();
        nextPieces.shift();

        getRandomPiece(nextPieces, CONFIG.PIECE_BAG_AMOUNT.value);

        // Assigning the values.
        this.mode = gameMode;
        this.over = false;
        this.finished = false;
        this.paused = false;
        this.frozen = false;

        this.maxLines = maxLines;
        this.maxTime = maxTime;

        this.board = new Board();
        this.currentPiece = currentPiece;
        this.nextPieces = nextPieces;
        this.pieceCountList = [0, 0, 0, 0, 0, 0, 0];

        this.shadowPiece = this.currentPiece.getShadowCoordinates(this.board);
        this.holdPiece = null;
        this.canHold = true;

        this.lastMove = Move.None;

        this.backToBack = -1;
        this.currentCombo = -1;

        this.currentDrop = 0;

        this.score = 0;
        this.lineCount = 0;
        this.lineCountList = [0, 0, 0, 0];
        this.level = startLevel;
        this.tSpinCountList = [0, 0];

        this.ticks = 0;
        this.timer = new Timer();

        this.lockTicksRemaining = CONFIG.PIECE_LOCK_TICKS.value;
        this.waitForLock = false;
        this.lockMoveResets = CONFIG.LOCK_MOVE_RESETS.value;

        this.keyEvents = {
            ArrowLeft: null,
            ArrowRight: null,
            ArrowDown: null
        };

        this.audioPlayer = new AudioPlayer();

        // Spawning the first piece.
        this.currentPiece.spawn(this.board);

        this.incrementPieceCount();

        this.audioPlayer.playSound('gameStart');
    }

    /**
     * Advances the game loop by one tick every 1/60th of a second.
     */
    advanceTick(): void {
        setTimeout(() => {
            this.timer.update();

            if (this.maxTime && this.timer.currentTime >= this.maxTime) {
                // If the game is over, we manually un-pause,
                // if it happens to be paused.
                this.paused = false;
                this.finished = true;
                this.audioPlayer.playSound('gameFinished');
            }

            // If the game is paused we pretty much do nothing,
            // except updating the timer and checking if it's over the limit.
            if (!this.paused || this.frozen) {
                this.ticks++;

                // Checking if the game is finished.
                if (this.maxLines && this.lineCount >= this.maxLines) {
                    this.finished = true;
                    this.audioPlayer.playSound('gameFinished');
                }

                // When the game is waiting for a locked piece to "finish",
                // we decrement the timer
                if (this.waitForLock) {
                    this.lockTicksRemaining--;
                    this.moveDown(false, false);
                }

                const threshold = this.getFallSpeed();
                if (this.ticks % threshold === 0) {
                    this.moveDown(false, false);
                    this.ticks = 0;
                }
            }

            if (!this.over && !this.finished) {
                this.advanceTick();
            } else {
                // If the game is over, we set the high score and increment the overall stats.
                setHighScore(this.mode, this.score, this.timer.currentTime, this.over);
                incrementLifetimeStats(this);
            }
        }, 1000 / 60);
    }

    /**
     * Resets the game.
     */
    reset(): void {
        const nextPieces = getRandomPiece([], CONFIG.PIECE_BAG_AMOUNT.value, true);

        const currentPiece = nextPieces[0];
        nextPieces.shift();

        getRandomPiece(nextPieces, CONFIG.PIECE_BAG_AMOUNT.value);

        this.over = false;
        this.finished = false;
        this.paused = false;
        this.frozen = false;

        this.board = new Board();
        this.currentPiece = currentPiece;
        this.nextPieces = nextPieces;
        this.pieceCountList = [0, 0, 0, 0, 0, 0, 0];

        this.holdPiece = null;
        this.canHold = true;

        this.lastMove = Move.None;

        this.backToBack = -1;
        this.currentCombo = -1;

        this.currentDrop = 0;

        this.score = 0;
        this.lineCount = 0;
        this.lineCountList = [0, 0, 0, 0];
        this.level = 1;
        this.tSpinCountList = [0, 0];

        this.ticks = 0;
        this.timer = new Timer();

        this.lockTicksRemaining = CONFIG.PIECE_LOCK_TICKS.value;
        this.waitForLock = false;

        this.keyEvents = {
            ArrowLeft: null,
            ArrowRight: null,
            ArrowDown: null
        };

        this.currentPiece.spawn(this.board);

        this.shadowPiece = this.currentPiece.getShadowCoordinates(this.board);

        this.incrementPieceCount();

        // And of course we need to enable the main game loop again.
        this.advanceTick();

        this.audioPlayer.playSound('gameStart');
    }

    /**
     * Handles the automatic and manual down-movement of pieces.
     */
    moveDown(drop: boolean, manual: boolean): void {
        if (drop) {
            const scoreGain = 2 * this.currentPiece.dropDown(this.board);
            this.score += scoreGain;

            if (scoreGain > 2 && manual) {
                this.lastMove = Move.Drop;
            }

            this.invokeNextTurn(CONFIG.LINE_CLEAR_DELAY.value);
        } else {
            const b = this.currentPiece.moveDown(this.board);
            if (!b) {
                // When we cannot move a piece down, it enters the "pre-locked" stage
                // where you have 30 ticks (0.5s) to move it again, or it becomes locked.
                this.waitForLock = true;
                // If the 30 ticks are up, we lock the piece for real.
                if (this.lockTicksRemaining <= 0 && !this.frozen) {
                    this.lockTicksRemaining = CONFIG.PIECE_LOCK_TICKS.value;
                    this.score += this.currentDrop;

                    this.audioPlayer.playSound('lock');

                    this.invokeNextTurn(CONFIG.LINE_CLEAR_DELAY.value);
                }
            } else {
                if (manual) {
                    this.lastMove = Move.Drop;
                }
            }
        }

        // This will update the shadow coordinates when a new piece spawns.
        // Otherwise this is fairly useless.
        this.shadowPiece = this.currentPiece.getShadowCoordinates(this.board);
    }

    /**
     * Invokes the next turn, after waiting X milliseconds.
     */
    invokeNextTurn(delay: number): void {
        const fullLines = this.board.getFullLines();

        this.currentDrop = 0;
        this.lockTicksRemaining = CONFIG.PIECE_LOCK_TICKS.value;

        // First, we grey the pieces out if the user wishes to do so.
        if (!CONFIG.COLORED_BOARD) {
            const coords = this.currentPiece.getCoordinates();

            for (let i = 0; i < coords.length; i++) {
                // 8 corresponds to the greyed out color.
                this.board.GameBoard[coords[i][0]][coords[i][1]] = 8;
            }
        }

        // Setting the whole row to white blocks only.
        // But we only do so if the delay is great enough,
        // otherwise the effect will look weird.
        if (delay > 100) {
            for (let i = 0; i < fullLines.length; i++) {
                this.board.GameBoard[fullLines[i]] = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
            }
        }

        if (fullLines.length > 0) {
            this.audioPlayer.playSound(`lineclear-${fullLines.length}`);
        }

        if (delay > 0 && fullLines.length > 0) {
            this.frozen = true;
            setTimeout(() => {
                this.nextTurn();
            }, delay);
        } else {
            this.nextTurn();
        }
    }

    /**
     * Handles the ending of a "turn" meaning the spawning of a new piece,
     * deleting of any full lines, incrementing the score etc.
     */
    nextTurn(): void {
        this.frozen = false;

        if (this.over || this.finished) {
            return;
        }

        // First we check for the lines that need to be deleted.
        const fullLines = this.board.getFullLines();

        this.lineCount += fullLines.length;
        this.lineCountList[fullLines.length - 1] += 1;

        // This detects the ongoing combo.
        if (fullLines.length !== 0) {
            this.currentCombo++;
            this.score += 50 * this.level * this.currentCombo;
        } else {
            this.currentCombo = -1;
        }

        // This detects a T-Spin
        const tSpin = this.detectTSpin();

        if (tSpin === TSpin.Mini) {
            this.tSpinCountList[0]++;
            this.audioPlayer.playSound('tSpinMini');
        } else if (tSpin === TSpin.Full) {
            this.tSpinCountList[1]++;
            this.audioPlayer.playSound('tSpinFull');
        }

        // This detects back-to-back "difficult moves"
        // Reference: https://tetris.wiki/Scoring#Recent_guideline_compatible_games
        if (fullLines.length > 0) {
            if (fullLines.length === 4 || (fullLines.length > 0 && tSpin !== TSpin.None)) {
                this.backToBack++;
            } else {
                // If you clear a line that is not difficult, we reset the counter.
                this.backToBack = -1;
            }
        }

        // Then we actually delete the lines.
        // This needs to be between the T-Spin detection and the full-clear detection.
        // Because the T-Spin detection checks for existing blocks around the T Piece
        // and the full-clear detection checks for the state after the lines are cleared.
        for (let i = 0; i < fullLines.length; i++) {
            this.board.deleteLine(fullLines[i]);
        }

        // This will detect a full-clear.
        const boardSum = this.board.GameBoard.reduce(function (a, b) {
            return a.concat(b);
        }).reduce(function (a, b) {
            return a + b;
        });
        const fullClear = boardSum === 0 && fullLines.length > 0 ? true : false;

        const multiplier = this.level * (this.backToBack > 0 ? 1.5 : 1);

        this.score += this.getScore(fullLines.length, multiplier, tSpin, fullClear);

        if (this.lineCount / 10 >= this.level) {
            this.audioPlayer.playSound('levelUp');
            this.level++;
        }

        // We get the new piece from the stack of next pieces.
        const nextPiece = this.nextPieces[0];
        this.currentPiece = nextPiece;

        this.incrementPieceCount();

        // Checking if the piece can spawn, if not this is an automatic game over.
        const b = this.currentPiece.spawn(this.board);
        if (!b) {
            this.over = true;
            this.audioPlayer.playSound('gameOver');
        }

        // Then we populate the queue some more if it needs it.
        this.nextPieces = getRandomPiece(this.nextPieces, CONFIG.PIECE_BAG_AMOUNT.value);
        // Then we remove the first piece from the piece queue.
        this.nextPieces.shift();

        // After all of that we reset the ticks and the ability to hold a new piece.
        this.ticks = 0;
        this.canHold = true;
        this.waitForLock = false;
        this.lockMoveResets = CONFIG.LOCK_MOVE_RESETS.value;

        this.shadowPiece = this.currentPiece.getShadowCoordinates(this.board);
    }

    /**
     * Holds a piece and spawns either the currently held piece, or the next one from the stack if you are not holding one.
     * Returns if the operation succeeded.
     */
    toggleHoldPiece(): boolean {
        // You can only hold a piece one time per turn, otherwise you could just stall forever.
        if (!this.canHold) {
            return false;
        }

        this.audioPlayer.playSound('holdPiece');

        // Despawning the current piece.
        const pieceCoordinates = this.currentPiece.getCoordinates();
        for (let i = 0; i < pieceCoordinates.length; i++) {
            const coords = pieceCoordinates[i];
            this.board.GameBoard[coords[0]][coords[1]] = 0;
        }

        // If you are not currently holding a piece, it is like ending your turn, kind of.
        if (!this.holdPiece) {
            // First we move the current piece over.
            this.holdPiece = this.currentPiece;

            // Then get the next piece in.
            const nextPiece = this.nextPieces[0];
            this.currentPiece = nextPiece;

            // Checking if the piece can spawn, if not this is an automatic game over.
            const b = this.currentPiece.spawn(this.board);
            if (!b) {
                this.over = true;
            }

            // Then we populate the queue some more if it needs it.
            this.nextPieces = getRandomPiece(this.nextPieces, CONFIG.PIECE_BAG_AMOUNT.value);
            // Then we remove the first piece from the piece queue.
            this.nextPieces.shift();

            // But we have to make sure to set all this to false (or 0).
            this.ticks = 0;
            this.canHold = false;
            this.waitForLock = false;

            return true;
        }

        // If you are holding a piece, we swap the current piece and the hold piece.
        const bufferPiece = this.currentPiece;
        this.currentPiece = this.holdPiece;
        this.holdPiece = bufferPiece;

        // Then spawning the previously held piece.

        this.currentPiece.spawn(this.board);

        this.ticks = 0;
        this.canHold = false;
        this.waitForLock = false;

        return true;
    }

    detectTSpin(): TSpin {
        let tSpin = TSpin.None;

        if (this.currentPiece.name !== 'T') {
            return tSpin;
        }

        if (this.lastMove !== Move.Rotation) {
            return tSpin;
        }

        let frontLeft = [0, 0];
        let frontRight = [0, 0];
        let backLeft = [0, 0];
        let backRight = [0, 0];

        switch (this.currentPiece.currentRotation) {
            case 0:
                frontLeft = [this.currentPiece.offset[0], this.currentPiece.offset[1]];
                frontRight = [this.currentPiece.offset[0], this.currentPiece.offset[1] + 2];
                backLeft = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1]];
                backRight = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1] + 2];
                break;
            case 1:
                frontLeft = [this.currentPiece.offset[0], this.currentPiece.offset[1] + 2];
                frontRight = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1] + 2];
                backLeft = [this.currentPiece.offset[0], this.currentPiece.offset[1]];
                backRight = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1]];
                break;
            case 2:
                frontLeft = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1]];
                frontRight = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1] + 2];
                backLeft = [this.currentPiece.offset[0], this.currentPiece.offset[1]];
                backRight = [this.currentPiece.offset[0], this.currentPiece.offset[1] + 2];
                break;
            case 3:
                frontLeft = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1]];
                frontRight = [this.currentPiece.offset[0], this.currentPiece.offset[1]];
                backLeft = [this.currentPiece.offset[0], this.currentPiece.offset[1] + 2];
                backRight = [this.currentPiece.offset[0] + 2, this.currentPiece.offset[1] + 2];
                break;
            default:
                break;
        }

        // We check how many of the pieces are occupied.
        // If 2 front pieces and 1 back piece is occupied by another block, this counts as a proper T-Spin.
        // If 2 back pieces and 1 front piece are occupied, it is a Mini T-Spin.
        let backPiecesOccupied = 0;
        let frontPiecesOccupied = 0;

        // The front pieces cannot be undefined by default, but the back pieces could.
        // If the back pieces are against the wall (thus are undefined), these also count as an occupied piece.
        if (this.board.GameBoard[frontLeft[0]][frontLeft[1]] !== 0) {
            frontPiecesOccupied++;
        }

        if (this.board.GameBoard[frontRight[0]][frontRight[1]] !== 0) {
            frontPiecesOccupied++;
        }

        if (
            this.board.GameBoard[backLeft[0]] === undefined ||
            this.board.GameBoard[backLeft[0]][backLeft[1]] !== 0
        ) {
            backPiecesOccupied++;
        }

        if (
            this.board.GameBoard[backRight[0]] === undefined ||
            this.board.GameBoard[backRight[0]][backRight[1]] !== 0
        ) {
            backPiecesOccupied++;
        }

        if (frontPiecesOccupied == 2 && backPiecesOccupied > 0) {
            tSpin = TSpin.Full;
        } else if (backPiecesOccupied == 2 && frontPiecesOccupied > 0) {
            tSpin = TSpin.Mini;
        }

        return tSpin;
    }

    /**
     * Gets the score depending on the amount of lines cleared and the current level.
     * Taken from: https://tetris.wiki/Scoring#Recent_guideline_compatible_games
     */
    getScore(
        linesCleared: number,
        multiplier: number,
        tSpin: TSpin = TSpin.None,
        fullClear: boolean = false
    ): number {
        if (tSpin === TSpin.Mini) {
            switch (linesCleared) {
                case 0:
                    return 100 * multiplier;
                case 1:
                    return 200 * multiplier;
                case 2:
                    return 400 * multiplier;
                // A Mini-T-Spin triple is not possible.
                default:
                    return 0;
            }
        }

        if (tSpin === TSpin.Full) {
            switch (linesCleared) {
                case 0:
                    return 400 * multiplier;
                case 1:
                    return 800 * multiplier;
                case 2:
                    return 1200 * multiplier;
                case 3:
                    return 1600 * multiplier;
                default:
                    return 0;
            }
        }

        if (fullClear) {
            switch (linesCleared) {
                case 1:
                    return 800 * multiplier;
                case 2:
                    return 1200 * multiplier;
                case 3:
                    return 1800 * multiplier;
                case 4:
                    return 2000 * multiplier;
                default:
                    return 0;
            }
        }

        switch (linesCleared) {
            case 1:
                return 100 * multiplier;
            case 2:
                return 300 * multiplier;
            case 3:
                return 500 * multiplier;
            case 4:
                return 800 * multiplier;
            default:
                return 0;
        }
    }

    /**
     * Gets the amount of seconds before a piece falls down by one grid.
     * These are from the original NES Version of Tetris (But we start at level 1 instead of 0).
     * The original game runs at 60(~ish) frames per second.
     */
    getFallSpeed(): number {
        if (this.level < 10) {
            // It scales linearly up until NES Level 8 (Our Level 9).
            return 53 - 5 * this.level;
        } else if (this.level < 11) {
            return 6;
        } else if (this.level < 14) {
            return 5;
        } else if (this.level < 17) {
            return 4;
        } else if (this.level < 20) {
            return 3;
        } else if (this.level < 30) {
            return 2;
        } else {
            return 1;
        }
    }

    /**
     * Increments the piece counter for each individual piece.
     */
    incrementPieceCount(): void {
        // Incrementing the individual piece counts.
        switch (this.currentPiece.name) {
            case 'I':
                this.pieceCountList[0] += 1;
                break;
            case 'J':
                this.pieceCountList[1] += 1;
                break;
            case 'L':
                this.pieceCountList[2] += 1;
                break;
            case 'O':
                this.pieceCountList[3] += 1;
                break;
            case 'S':
                this.pieceCountList[4] += 1;
                break;
            case 'Z':
                this.pieceCountList[5] += 1;
                break;
            case 'T':
                this.pieceCountList[6] += 1;
                break;
            default:
                break;
        }
    }
}
