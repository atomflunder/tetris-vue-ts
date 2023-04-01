<script setup lang="ts">
import { CONTROLS } from '@/helpers/controls';
</script>

<template>
    <div class="game-paused">GAME PAUSED</div>
    <div class="info">{{ CONTROLS.PAUSE_GAME.value.toUpperCase() }} TO UNPAUSE</div>
</template>

<style scoped>
.game-paused {
    color: #fff;
    font-size: 1.6rem;
    margin-top: 150px;
    margin-left: 15px;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
}

.info {
    top: 25%;
    font-size: 1rem;
    margin-left: 15px;
    color: #fff;
}
</style>
