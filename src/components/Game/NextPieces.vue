<script setup lang="ts">
import { CONFIG } from '@/helpers/config';
import type { Game } from '@/helpers/game';
import { getPreviewPieceTable } from '@/helpers/pieceData';
import { getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    NEXT:
    <table>
        <tr
            v-for="(row, i) in getPreviewPieceTable(
                game.nextPieces.slice(0, CONFIG.PREVIEW_PIECE_AMOUNT.value)
            )"
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
