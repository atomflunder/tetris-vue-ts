<script setup lang="ts">
import { CONTROLS } from '@/helpers/consts';
</script>

<template>
    <div class="game-over">GAME OVER!</div>
    <div class="game-over info">{{ CONTROLS.RESET_GAME.toUpperCase() }} TO RESET</div>
</template>

<style scoped>
.game-over {
    color: #ffffff;
    position: absolute;
    top: 20%;
    left: 40%;
    font-size: 1.8rem;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
}

.info {
    top: 25%;
    font-size: 1.25rem;
}
</style>
