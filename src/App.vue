<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Game } from './helpers/game';
import { getPreviewPieceTable } from './helpers/pieces';
import { allPieces } from './helpers/pieceData';

const game = reactive(new Game());

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
        case 8:
            // Maybe used for garbage blocks in the future.
            return 'greyed-out block';
        default:
            // If the piece is not filled in, we check if it is occupied by a "shadow" piece.
            // If that is the case, we render a slightly transparent color of the current piece.
            for (let k = 0; k < game.shadowPiece.length; k++) {
                if (game.shadowPiece[k][0] === i && game.shadowPiece[k][1] === j) {
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
    if (game.board.inDanger(game.currentPiece)) {
        return 'red-glow ';
    } else {
        return '';
    }
}

onkeydown = (e: KeyboardEvent) => {
    game.handleInput(e);
};

onkeyup = (e: KeyboardEvent) => {
    // Resetting the down counter when the player releases the down key.
    if (e.key === 'ArrowDown') {
        game.currentDrop = 0;
    }
};

onMounted(() => {
    game.advanceTick();
});
</script>

<template>
    <div class="app">
        <div class="game-info left-column">
            <table>
                <tr>
                    <td>Score: {{ game.score }}</td>
                    <td>Level: {{ game.level }}</td>
                </tr>

                <tr>
                    <td colspan="2">
                        Total Lines:
                        {{ game.totalLines }}
                        <table class="line-table">
                            <tr>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block empty"></td>
                                <td class="small-block empty"></td>
                                <td class="small-block empty"></td>
                                <td>Single: {{ game.lineCounter[0] }}</td>
                            </tr>
                            <tr>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block empty"></td>
                                <td class="small-block empty"></td>
                                <td>Double: {{ game.lineCounter[1] }}</td>
                            </tr>
                            <tr>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block empty"></td>
                                <td>Triple: {{ game.lineCounter[2] }}</td>
                            </tr>
                            <tr>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block greyed-out"></td>
                                <td class="small-block greyed-out"></td>
                                <td>Tetris: {{ game.lineCounter[3] }}</td>
                            </tr>
                            <tr></tr>
                        </table>
                    </td>
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

.line-table {
    border-collapse: separate;
    border-spacing: 15px 2px;
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
