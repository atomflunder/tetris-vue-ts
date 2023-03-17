<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { getPreviewPieceTable, allPieces } from '@/helpers/pieceData';
import { getColorClass } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <td colspan="4">
        Pieces:
        <table>
            <td v-for="(count, i) in game.pieceCounter" :key="i">
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
    </td>
</template>

<style scoped></style>
