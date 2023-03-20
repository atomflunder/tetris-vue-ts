<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { getGlow, getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <table :class="getGlow(game)">
        <tr v-for="(row, i) in game.board.GameBoard" :key="i">
            <td v-for="(block, j) in row" :key="j" :class="getColorClass(game, block, i, j)"></td>
        </tr>
    </table>
</template>

<style scoped>
.red-glow {
    -webkit-box-shadow: 0 0 15px #ff0000;
    box-shadow: 0 0 15px #ff0000;
}

.blue-glow {
    -webkit-box-shadow: 0 0 15px #002fff;
    box-shadow: 0 0 15px #002fff;
}

.purple-glow {
    -webkit-box-shadow: 0 0 15px #9300b1;
    box-shadow: 0 0 15px #9300b1;
}

.orange-glow {
    -webkit-box-shadow: 0 0 15px #ffae00;
    box-shadow: 0 0 15px #ffae00;
}

.green-glow {
    -webkit-box-shadow: 0 0 15px #00ff22;
    box-shadow: 0 0 15px #00ff22;
}
</style>
