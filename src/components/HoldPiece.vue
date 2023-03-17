<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { getPreviewPieceTable } from '@/helpers/pieceData';
import { getHeldPieceColor, getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    Held Piece:
    <table v-if="game.holdPiece">
        <tr v-for="(row, i) in getPreviewPieceTable([game.holdPiece])" :key="i">
            <td v-for="(block, j) in row" :key="j" :class="getHeldPieceColor(game, block)"></td>
        </tr>
    </table>
    <table v-else>
        <tr
            v-for="(row, i) in [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]"
            :key="i"
        >
            <td
                v-for="(block, j) in row"
                :key="j"
                :class="getColorClass(game, block, -1, -1) + ' small-block'"
            ></td>
        </tr>
    </table>
</template>

<style scoped></style>
