<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { getPreviewPieceTable } from '@/helpers/pieceData';
import { getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    Next Pieces:
    <table>
        <tr v-for="(row, i) in getPreviewPieceTable(game.nextPieces.slice(0, 14))" :key="i">
            <td
                v-for="(block, j) in row"
                :key="j"
                :class="getColorClass(game, block, -1, -1) + ' small-block'"
            ></td>
        </tr>
    </table>
</template>

<style scoped></style>
