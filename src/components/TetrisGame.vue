<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Game } from '../helpers/game';

import LineCount from '@/components/Game/LineCount.vue';
import PieceCount from '@/components/Game/PieceCount.vue';
import HoldPiece from '@/components/Game/HoldPiece.vue';
import NextPieces from '@/components/Game/NextPieces.vue';
import TetrisBoard from '@/components/Game/TetrisBoard.vue';
import GameStats from '@/components/Game/GameStats.vue';
import GameOver from '@/components/Game/GameOver.vue';
import KeyboardControls from '@/components/Game/KeyboardControls.vue';
import PauseOverlay from '@/components/Game/PauseOverlay.vue';

const props = defineProps<{
    maxLines: number | null;
    maxTime: number | null;
}>();

const game = reactive(new Game(props.maxLines, props.maxTime));

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
        <div class="game-info font">
            <GameStats :game="game" />
        </div>

        <div class="line-count font">
            <LineCount :game="game" />
        </div>

        <div class="piece-count font">
            <PieceCount :game="game" />
        </div>

        <div class="center-column">
            <TetrisBoard :game="game" />
        </div>

        <div class="center-column"><PauseOverlay v-if="game.isPaused" /></div>

        <div class="center-column"><GameOver v-if="game.gameOver" /></div>

        <div class="next-column font">
            <NextPieces :game="game" />
        </div>
        <div class="held-column font">
            <HoldPiece :game="game" />
        </div>
        <div class="controls font">
            <KeyboardControls />
        </div>
    </div>
</template>

<style scoped>
.app {
    display: grid;
    gap: 3.5rem 1rem;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
}

.font {
    color: #ddd;
    font-size: 1.2rem;
}

.center-column {
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 5;
    min-width: 400px;
    min-height: 660px;
}

.next-column {
    grid-column-start: 4;
    grid-row-start: 1;
    grid-row-end: 5;
    min-width: 130px;
    min-height: 310px;
}

.held-column {
    grid-column-start: 5;
    min-width: 130px;
    min-height: 130px;
}

.controls {
    grid-column-start: 5;
    grid-row-start: 2;
    grid-row-end: 5;
    width: 500px;
}

.game-info {
    grid-column-start: 1;
    grid-row-start: 1;
    grid-row-end: 2;
    min-width: 500px;
    min-height: 130px;
}

.line-count {
    grid-column-start: 1;
    grid-row-start: 2;
    grid-row-end: 3;
    min-width: 500px;
    min-height: 130px;
}

.piece-count {
    grid-column-start: 1;
    grid-row-start: 3;
    grid-row-end: 4;
    min-width: 500px;
    min-height: 130px;
}

@media (max-width: 1700px) {
    .controls {
        display: none;
    }
}

@media (max-width: 1250px) {
    .game-info {
        display: none;
    }

    .line-count {
        display: none;
    }

    .piece-count {
        display: none;
    }
}
</style>