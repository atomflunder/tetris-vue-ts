<script setup lang="ts">
import { CONTROLS } from '@/helpers/consts';
</script>

<template>
    <div class="game-paused">GAME PAUSED</div>
    <div class="game-paused info">{{ CONTROLS.PAUSE_GAME.toUpperCase() }} TO UNPAUSE</div>
</template>

<style scoped>
.game-paused {
    color: #fff;
    position: absolute;
    top: 20%;
    left: 40%;
    font-size: 1.6rem;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
}

.info {
    top: 25%;
    font-size: 1rem;
}
</style>
