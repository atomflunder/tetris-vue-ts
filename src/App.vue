<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Game } from './helpers/game';

import LineCount from './components/LineCount.vue';
import PieceCount from './components/PieceCount.vue';
import HoldPiece from './components/HoldPiece.vue';
import NextPieces from './components/NextPieces.vue';
import TetrisBoard from './components/TetrisBoard.vue';
import GameStats from './components/GameStats.vue';
import GameOver from './components/GameOver.vue';
import KeyboardControls from './components/KeyboardControls.vue';
import PauseOverlay from './components/PauseOverlay.vue';

const game = reactive(new Game());

onkeydown = (e: KeyboardEvent) => {
    game.handleInput(e);
};

onkeyup = (e: KeyboardEvent) => {
    game.handleKeyup(e);
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
                    <GameStats :game="game" />
                </tr>

                <tr>
                    <KeyboardControls />
                </tr>

                <tr>
                    <LineCount :game="game" />
                </tr>

                <tr>
                    <PieceCount :game="game" />
                </tr>
            </table>
        </div>

        <TetrisBoard :game="game" />
        <PauseOverlay v-if="game.isPaused" />
        <GameOver v-if="game.gameOver" />

        <div class="next-column piece-info">
            <NextPieces :game="game" />
        </div>
        <div class="held-column piece-info">
            <HoldPiece :game="game" />
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

.piece-info {
    color: #ddd;
    font-size: 1.2rem;
}
</style>
