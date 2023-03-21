<script setup lang="ts">
import { CONTROLS } from '@/helpers/consts';
</script>

<template>
    <div class="game-over">GAME OVER!</div>
    <div class="info">{{ CONTROLS.RESET_GAME.toUpperCase() }} TO RESET</div>
</template>

<style scoped>
.game-over {
    color: #ffffff;
    margin-top: 150px;
    margin-left: 15px;
    font-size: 1.8rem;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
}

.info {
    top: 25%;
    font-size: 1.25rem;
    color: #ffffff;
    margin-left: 15px;
}
</style>
