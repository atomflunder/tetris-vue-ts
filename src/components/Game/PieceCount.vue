<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { getPreviewPieceTable, allPieces } from '@/helpers/pieceData';
import { getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <div class="grid">
        <div class="header">TOTAL PIECES: {{ game.pieceCountList.reduce((a, b) => a + b) }}</div>
        <div class="piece-table">
            <table>
                <td v-for="(count, i) in game.pieceCountList" :key="i">
                    <tr
                        v-for="(row, j) in getPreviewPieceTable([
                            JSON.parse(JSON.stringify(allPieces[i]))
                        ])"
                        :key="j"
                    >
                        <td
                            v-for="(block, j) in row"
                            :key="j"
                            :class="getColorClass(game, block, -1, -1) + ' small-block'"
                        ></td>
                    </tr>
                    {{ count }}
                </td>
            </table>
        </div>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
}

.header {
    grid-column-start: 1;
    grid-row-start: 1;
}

.piece-table {
    grid-column-start: 1;
    grid-row-start: 2;
}
</style>
