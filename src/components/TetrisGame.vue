<script setup lang="ts">
import { onMounted, ref } from 'vue';

import GameFinished from '@/components//Game/GameFinished.vue';
import CountdownTransition from '@/components/Game/CountdownTransition.vue';
import GameOver from '@/components/Game/GameOver.vue';
import GameStats from '@/components/Game/GameStats.vue';
import HoldPiece from '@/components/Game/HoldPiece.vue';
import KeyboardControls from '@/components/Game/KeyboardControls.vue';
import LineCount from '@/components/Game/LineCount.vue';
import NextPieces from '@/components/Game/NextPieces.vue';
import PauseOverlay from '@/components/Game/PauseOverlay.vue';
import PieceCount from '@/components/Game/PieceCount.vue';
import TetrisBoard from '@/components/Game/TetrisBoard.vue';

import { CONTROLS, handleInput, handleKeyup } from '@/helpers/controls';
import { Game } from '@/helpers/game';
import type { Menu } from '@/helpers/types';
import { CONFIG } from '@/helpers/config';

const props = defineProps<{
    gameMode: Menu;
    maxLines: number | null;
    maxTime: number | null;
    startLevel: number;
}>();

const emits = defineEmits(['back-to-menu']);

const game = ref(new Game(props.gameMode, props.maxLines, props.maxTime, props.startLevel));
game.value.frozen = true;

onkeydown = (e: KeyboardEvent) => {
    handleInput(e, game.value);
};

onkeyup = (e: KeyboardEvent) => {
    if (game.value.over || game.value.finished) {
        if (e.key === CONTROLS.RESET_GAME.value) {
            game.value = new Game(props.gameMode, props.maxLines, props.maxTime, props.startLevel);
            game.value.frozen = true;
            runCountdown();
        } else if (e.key === CONTROLS.BACK_TO_MENU.value) {
            emits('back-to-menu');
        }

        return;
    }

    handleKeyup(e, game.value);
};

let count = ref(-1);

function runCountdown(): void {
    count.value = 3;

    game.value.audioPlayer.playSound('countdown');

    const interval = setInterval(() => {
        if (count.value > -1) {
            count.value--;
            game.value.audioPlayer.playSound('countdown');
        } else {
            clearInterval(interval);
            game.value.start();
        }
    }, 750); // Deliberately not a full second.
}

onMounted(() => {
    runCountdown();
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

        <div class="center-column"><CountdownTransition :count="count" /></div>
        <div class="center-column"><PauseOverlay v-if="game.paused" /></div>
        <div class="center-column"><GameOver v-if="game.over" /></div>
        <div class="center-column"><GameFinished v-if="game.finished" :game="game" /></div>

        <div class="next-column font" v-if="CONFIG.PREVIEW_PIECE_AMOUNT.value > 0">
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
    grid-row-end: 3;
    min-width: 500px;
    min-height: 130px;
}

.line-count {
    grid-column-start: 1;
    grid-row-start: 3;
    grid-row-end: 4;
    min-width: 500px;
    min-height: 130px;
}

.piece-count {
    grid-column-start: 1;
    grid-row-start: 4;
    grid-row-end: 5;
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
