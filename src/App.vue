<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { getFallSpeed, newGame, nextTurn } from './helpers/game';
import {
    dropPieceDown,
    getShadowPieceCoordinates,
    movePieceDown,
    movePieceLeft,
    movePieceRight,
    rotatePiece,
    holdPiece,
    getPreviewPieceTable
} from './helpers/pieces';
import { allPieces } from './helpers/pieceData';
import { inDanger } from './helpers/board';

const game = reactive(newGame());

let shadowPieceCoordinates: number[][] = getShadowPieceCoordinates(game.board, game.currentPiece);

function moveDown(drop: boolean): void {
    if (drop) {
        // In the original NES Version of Tetris you get 1 point for every cell you drop a piece down manually.
        // I like the idea so we are copying it for both hard and soft drops to reward fast play.
        game.score += dropPieceDown(game.board, game.currentPiece);
        nextTurn(game);
    } else {
        let b = movePieceDown(game.board, game.currentPiece);
        if (!b) {
            game.score += game.currentDrop;
            nextTurn(game);
        }
    }

    // This will update the shadow coordinates when a new piece spawns.
    // Otherwise this is fairly useless.
    shadowPieceCoordinates = getShadowPieceCoordinates(game.board, game.currentPiece);
}

function getColorClass(block: number, i: number, j: number): string {
    switch (block) {
        case 1:
            return 'i block';
        case 2:
            return 'j block';
        case 3:
            return 'l block';
        case 4:
            return 'o block';
        case 5:
            return 's block';
        case 6:
            return 'z block';
        case 7:
            return 't block';
        default:
            // If the piece is not filled in, we check if it is occupied by a "shadow" piece.
            // If that is the case, we render a slightly transparent color of the current piece.
            for (let k = 0; k < shadowPieceCoordinates.length; k++) {
                if (shadowPieceCoordinates[k][0] === i && shadowPieceCoordinates[k][1] === j) {
                    return `${game.currentPiece.name.toLowerCase()} block transparent`;
                }
            }
            // And if not, just an empty block.
            return 'empty block';
    }
}

function getHeldPieceColor(block: number): string {
    // If you can toggle the hold this "turn" we return the standard colors.
    if (game.holdThisTurn) {
        return getColorClass(block, -1, -1) + ' small-block';
    } else {
        // If you cannot toggle, we want the piece blocks to be greyed out.
        let color = getColorClass(block, -1, -1);
        if (color !== 'empty block') {
            return 'greyed-out empty small-block';
        } else {
            return 'empty small-block';
        }
    }
}

function isInDanger(): string {
    if (inDanger(game.board, game.currentPiece)) {
        return 'red-glow ';
    } else {
        return '';
    }
}

onkeydown = (e: KeyboardEvent) => {
    if (game.gameOver) {
        return;
    }

    switch (e.key) {
        case 'ArrowLeft':
            movePieceLeft(game.board, game.currentPiece);
            shadowPieceCoordinates = getShadowPieceCoordinates(game.board, game.currentPiece);
            break;
        case 'ArrowRight':
            movePieceRight(game.board, game.currentPiece);
            shadowPieceCoordinates = getShadowPieceCoordinates(game.board, game.currentPiece);
            break;
        case 'ArrowDown':
            moveDown(false);
            // Incrementing the drop counter for every time the game registers a consecutive down press.
            game.currentDrop += 1;
            break;
        case 'ArrowUp':
            moveDown(true);
            break;
        case ' ':
            rotatePiece(game.board, game.currentPiece, true);
            shadowPieceCoordinates = getShadowPieceCoordinates(game.board, game.currentPiece);
            break;
        case 'Enter':
            rotatePiece(game.board, game.currentPiece, false);
            shadowPieceCoordinates = getShadowPieceCoordinates(game.board, game.currentPiece);
            break;
        case '0':
            holdPiece(game);
            shadowPieceCoordinates = getShadowPieceCoordinates(game.board, game.currentPiece);
            break;
    }
};

onkeyup = (e: KeyboardEvent) => {
    // Resetting the down counter when the player releases the down key.
    if (e.key === 'ArrowDown') {
        game.currentDrop = 0;
    }
};

// This is the main game loop that drops pieces automatically.
const frame = (): void => {
    setTimeout(() => {
        game.ticks++;
        const threshold = getFallSpeed(game.level);
        if (game.ticks % threshold === 0) {
            moveDown(false);
            game.ticks = 0;
        }
        if (!game.gameOver) {
            frame();
        }
    }, 1000 / 60);
};

onMounted(() => {
    frame();
});
</script>

<template>
    <div class="app">
        <div class="game-info left-column">
            <table>
                <tr>
                    <td>Score: {{ game.score }}</td>
                    <td>Level: {{ game.level }}</td>
                    <td colspan="2">Total Lines: {{ game.totalLines }}</td>
                </tr>
                <tr>
                    <td>Singles: {{ game.lineCounter[0] }}</td>
                    <td>Doubles: {{ game.lineCounter[1] }}</td>
                    <td>Triples: {{ game.lineCounter[2] }}</td>
                    <td>Tetris: {{ game.lineCounter[3] }}</td>
                </tr>
                <tr>
                    <td colspan="4">
                        Pieces:
                        <table>
                            <td v-for="(count, i) in game.pieceCounter" :key="i">
                                <tr
                                    v-for="(row, j) in getPreviewPieceTable([
                                        JSON.parse(JSON.stringify(allPieces[i]))
                                    ])"
                                    :key="j"
                                >
                                    <td
                                        v-for="(block, j) in row"
                                        :key="j"
                                        :class="getColorClass(block, -1, -1) + ' small-block'"
                                    ></td>
                                </tr>
                                {{ count }}
                            </td>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
        <table :class="isInDanger() + 'main-table center-column'">
            <tr v-for="(row, i) in game.board.GameBoard" :key="i">
                <td v-for="(block, j) in row" :key="j" :class="getColorClass(block, i, j)"></td>
            </tr>
        </table>

        <div v-if="game.gameOver" class="game-info">Game Over!</div>

        <div class="next-column piece-info">
            Next Pieces:
            <table>
                <tr v-for="(row, i) in getPreviewPieceTable(game.nextPieces.slice(0, 14))" :key="i">
                    <td
                        v-for="(block, j) in row"
                        :key="j"
                        :class="getColorClass(block, -1, -1) + ' small-block'"
                    ></td>
                </tr>
            </table>
        </div>
        <div class="held-column piece-info">
            Held Piece:
            <table v-if="game.holdPiece">
                <tr v-for="(row, i) in getPreviewPieceTable([game.holdPiece])" :key="i">
                    <td v-for="(block, j) in row" :key="j" :class="getHeldPieceColor(block)"></td>
                </tr>
            </table>
            <table v-else>
                <tr
                    v-for="(row, i) in [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ]"
                    :key="i"
                >
                    <td
                        v-for="(block, j) in row"
                        :key="j"
                        :class="getColorClass(block, -1, -1) + ' small-block'"
                    ></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    clear: both;
    justify-content: center;
}

.left-column {
    width: 41%;
    float: left;
    justify-content: center;
    display: flex;
}

.next-column {
    width: 20.5%;
    float: right;
    justify-content: center;
    margin-left: 20px;
}

.held-column {
    width: 20.5%;
    float: right;
    justify-content: center;
}

.center-column {
    width: 18%;
}

.game-info {
    color: #ddd;
    font-size: 1.2rem;
}

.piece-info {
    color: #ddd;
    font-size: 1.2rem;
}

.single-piece {
    color: #ddd;
    display: inline-block;
}

.block {
    width: 30px;
    height: 30px;
}

.small-block {
    width: 15px;
    height: 15px;
}

.red-glow {
    box-shadow: 1px 1px 1px #ff0000;
}

.empty {
    background-color: #464646;
}

.i {
    background-color: #00ffff;
}

.j {
    background-color: #0000ff;
}

.l {
    background-color: #ff7f00;
}

.o {
    background-color: #ffff00;
}

.z {
    background-color: #ff0000;
}

.s {
    background-color: #00ff00;
}

.t {
    background-color: #bb00bb;
}

.greyed-out {
    background-color: #aaaaaa;
}

.transparent {
    opacity: 50%;
    background-color: #999999;
}
</style>
