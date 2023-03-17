<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { isInDanger, getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <table :class="isInDanger(game) + 'center-column'">
        <tr v-for="(row, i) in game.board.GameBoard" :key="i">
            <td v-for="(block, j) in row" :key="j" :class="getColorClass(game, block, i, j)"></td>
        </tr>
    </table>
    <div v-if="game.gameOver" class="game-info">GAME OVER!</div>
</template>

<style scoped>
.center-column {
    width: 18%;
}

.red-glow {
    box-shadow: 1px 1px 1px #ff0000;
}
</style>
