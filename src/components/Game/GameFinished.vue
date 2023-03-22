<script setup lang="ts">
import { CONTROLS } from '@/helpers/config';
import type { Game } from '@/helpers/game';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <div class="game-over">GAME FINISHED!</div>
    <div class="info">{{ CONTROLS.RESET_GAME.toUpperCase() }} TO RESTART</div>
    <div class="info">{{ CONTROLS.BACK_TO_MENU.toUpperCase() }} FOR MENU</div>

    <div class="stats">TIME: {{ game.timer.toReadableTime() }}</div>
    <div class="stats">LINES: {{ game.totalLines }}</div>
    <div class="stats">SCORE: {{ game.score }}</div>
</template>

<style scoped>
.game-over {
    color: #ffffff;
    margin-top: 150px;
    margin-left: 15px;
    font-size: 1.3rem;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
}

.info {
    top: 25%;
    font-size: 1.1rem;
    color: #ffffff;
    margin-left: 15px;
}

.stats {
    top: 25%;
    font-size: 1.1rem;
    color: #ffffff;
    margin-left: 15px;
    margin-top: 30px;
}
</style>
