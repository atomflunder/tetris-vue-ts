import { Board } from './board';
import { PIECE_BAG_AMOUNT, PIECE_LOCK_TICKS } from './consts';
import type { Piece } from './pieces';
import { getRandomPieceModern } from './rng';

export class Game {
    gameOver: boolean;

    board: Board;
    currentPiece: Piece;
    nextPieces: Piece[];
    // The individual count of each piece.
    pieceCounter: number[];

    // The coordinates of the "shadow" piece.
    shadowPiece: number[][];
    holdPiece: Piece | null;
    // You can only toggle held pieces once per turn.
    holdThisTurn: boolean;

    // We need to keep track of how long the player is holding down in a row.
    currentDrop: number;

    score: number;
    totalLines: number;
    // The specific line clears (Single, Double, Triple, Tetris)
    lineCounter: number[];
    level: number;

    // A tick is 1/60th of a second.
    ticks: number;
    // The amount of ticks after a piece gets locked without input.
    lockTick: number;
    waitForLock: boolean;

    constructor() {
        const nextPieces = getRandomPieceModern([], PIECE_BAG_AMOUNT, true);

        // Taking the first piece of the queue.
        const currentPiece = nextPieces[0];
        nextPieces.shift();

        getRandomPieceModern(nextPieces, PIECE_BAG_AMOUNT);

        // Assigning the values.
        this.gameOver = false;

        this.board = new Board();
        this.currentPiece = currentPiece;
        this.nextPieces = nextPieces;
        this.pieceCounter = [0, 0, 0, 0, 0, 0, 0];

        this.shadowPiece = this.currentPiece.getShadowPieceCoordinates(this.board);
        this.holdPiece = null;
        this.holdThisTurn = true;

        this.currentDrop = 0;

        this.score = 0;
        this.totalLines = 0;
        this.lineCounter = [0, 0, 0, 0];
        this.level = 1;

        this.ticks = 0;
        this.lockTick = PIECE_LOCK_TICKS;
        this.waitForLock = false;

        // Spawning the first piece.
        this.currentPiece.spawnPiece(this.board);

        this.incrementPieceCount();
    }

    // This is the main game loop that drops pieces automatically.
    advanceTick(): void {
        setTimeout(() => {
            this.ticks++;

            // When the game is waiting for a locked piece to "finish",
            // we decrement the timer
            if (this.waitForLock) {
                this.lockTick--;
                this.moveDown(false);
            }

            const threshold = this.getFallSpeed();
            if (this.ticks % threshold === 0) {
                this.moveDown(false);
                this.ticks = 0;
            }
            if (!this.gameOver) {
                this.advanceTick();
            }
        }, 1000 / 60);
    }

    handleInput(e: KeyboardEvent): void {
        if (this.gameOver) {
            return;
        }

        // When an action successfully completes, we update the lock ticks and the shadow piece coordinates.
        const update = (): void => {
            this.lockTick = PIECE_LOCK_TICKS;
            this.shadowPiece = this.currentPiece.getShadowPieceCoordinates(this.board);
        };

        switch (e.key) {
            case 'ArrowLeft':
                if (this.currentPiece.movePieceLeft(this.board)) {
                    update();
                }

                break;
            case 'ArrowRight':
                if (this.currentPiece.movePieceRight(this.board)) {
                    update();
                }

                break;
            case 'ArrowDown':
                this.moveDown(false);
                // Incrementing the drop counter for every time the game registers a consecutive down press.
                this.currentDrop += 1;
                // When you hold down you probably do want the piece to lock instantly.
                this.lockTick = 0;
                break;
            case 'ArrowUp':
                this.moveDown(true);
                break;
            case ' ':
                if (this.currentPiece.rotatePiece(this.board, true)) {
                    update();
                }
                break;
            case 'Enter':
                if (this.currentPiece.rotatePiece(this.board, false)) {
                    update();
                }
                break;
            case '0':
                if (this.toggleHoldPiece()) {
                    update();
                }

                break;
        }
    }

    handleKeyup(e: KeyboardEvent): void {
        // Resetting the down counter when the player releases the down key.
        if (e.key === 'ArrowDown') {
            this.currentDrop = 0;
            this.lockTick = PIECE_LOCK_TICKS;
        }
    }

    moveDown(drop: boolean): void {
        if (drop) {
            // In the original NES Version of Tetris you get 1 point for every cell you drop a piece down manually.
            // I like the idea so we are copying it for both hard and soft drops to reward fast play.
            this.score += this.currentPiece.dropPieceDown(this.board);
            this.nextTurn();
        } else {
            const b = this.currentPiece.movePieceDown(this.board);
            if (!b) {
                // When we cannot move a piece down, it enters the "pre-locked" stage
                // where you have 30 ticks (0.5s) to move it again, or it becomes locked.
                this.waitForLock = true;
                // If the 30 ticks are up, we lock the piece for real.
                if (this.lockTick <= 0) {
                    this.score += this.currentDrop;
                    this.nextTurn();
                }
            }
        }

        // This will update the shadow coordinates when a new piece spawns.
        // Otherwise this is fairly useless.
        this.shadowPiece = this.currentPiece.getShadowPieceCoordinates(this.board);
    }

    nextTurn(): void {
        if (this.gameOver) {
            return;
        }

        // First we check for the lines that need to be deleted.
        const fullLines = this.board.getFullLines();

        for (let i = 0; i < fullLines.length; i++) {
            this.board.deleteLine(fullLines[i]);
        }

        this.totalLines += fullLines.length;
        this.lineCounter[fullLines.length - 1] += 1;

        this.score += this.getScore(fullLines.length);

        this.level = Math.floor(this.totalLines / 10) + 1;

        // We get the new piece from the stack of next pieces.
        const nextPiece = this.nextPieces[0];
        this.currentPiece = nextPiece;

        this.incrementPieceCount();

        // Checking if the piece can spawn, if not this is an automatic game over.
        const b = this.currentPiece.spawnPiece(this.board);
        if (!b) {
            this.gameOver = true;
        }

        // Then we populate the queue some more if it needs it.
        this.nextPieces = getRandomPieceModern(this.nextPieces, PIECE_BAG_AMOUNT);
        // Then we remove the first piece from the piece queue.
        this.nextPieces.shift();

        // After all of that we reset the ticks and the ability to hold a new piece.
        this.ticks = 0;
        this.holdThisTurn = true;
        this.waitForLock = false;
    }

    /**
     * Holds a piece and spawns either the currently held piece, or the next one from the stack if you are not holding one.
     * Returns if the operation succeeded.
     */
    toggleHoldPiece(): boolean {
        // You can only hold a piece one time per turn, otherwise you could just stall forever.
        if (!this.holdThisTurn) {
            return false;
        }

        // Despawning the current piece.
        const pieceCoordinates = this.currentPiece.getPieceCoordinates();
        for (let i = 0; i < pieceCoordinates.length; i++) {
            const coords = pieceCoordinates[i];
            this.board.GameBoard[coords[0]][coords[1]] = 0;
        }

        // If you are not currently holding a piece, it is like ending your turn, kind of.
        if (!this.holdPiece) {
            this.holdPiece = this.currentPiece;
            this.nextTurn();
            // But we have to make sure to set this to false.
            this.holdThisTurn = false;
            return true;
        }

        // If you are holding a piece, we swap the current piece and the hold piece.
        const bufferPiece = this.currentPiece;
        this.currentPiece = this.holdPiece;
        this.holdPiece = bufferPiece;

        // Then spawning the previously held piece.

        this.currentPiece.spawnPiece(this.board);

        // Also need to set the ticks to 0 manually.
        this.ticks = 0;
        // And of course turn off the ability to swap again.
        this.holdThisTurn = false;

        return true;
    }

    /**
     * Gets the score depending on the amount of lines cleared and the current level.
     */
    getScore(linesCleared: number): number {
        // This is from the NES Tetris scoring algorithm.
        switch (linesCleared) {
            case 1:
                return 40 * this.level;
            case 2:
                return 100 * this.level;
            case 3:
                return 300 * this.level;
            case 4:
                return 1200 * this.level;
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

    incrementPieceCount(): void {
        // Incrementing the individual piece counts.
        switch (this.currentPiece.name) {
            case 'I':
                this.pieceCounter[0] += 1;
                break;
            case 'J':
                this.pieceCounter[1] += 1;
                break;
            case 'L':
                this.pieceCounter[2] += 1;
                break;
            case 'O':
                this.pieceCounter[3] += 1;
                break;
            case 'S':
                this.pieceCounter[4] += 1;
                break;
            case 'Z':
                this.pieceCounter[5] += 1;
                break;
            case 'T':
                this.pieceCounter[6] += 1;
                break;
            default:
                break;
        }
    }
}
