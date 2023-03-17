<script setup lang="ts">
import type { Game } from '@/helpers/game';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <td colspan="2">
        Total Lines:
        {{ game.totalLines }}
        <table class="line-table">
            <tr>
                <td class="small-block greyed-out"></td>
                <td class="small-block empty"></td>
                <td class="small-block empty"></td>
                <td class="small-block empty"></td>
                <td>Single: {{ game.lineCounter[0] }}</td>
            </tr>
            <tr>
                <td class="small-block greyed-out"></td>
                <td class="small-block greyed-out"></td>
                <td class="small-block empty"></td>
                <td class="small-block empty"></td>
                <td>Double: {{ game.lineCounter[1] }}</td>
            </tr>
            <tr>
                <td class="small-block greyed-out"></td>
                <td class="small-block greyed-out"></td>
                <td class="small-block greyed-out"></td>
                <td class="small-block empty"></td>
                <td>Triple: {{ game.lineCounter[2] }}</td>
            </tr>
            <tr>
                <td class="small-block greyed-out"></td>
                <td class="small-block greyed-out"></td>
                <td class="small-block greyed-out"></td>
                <td class="small-block greyed-out"></td>
                <td>Tetris: {{ game.lineCounter[3] }}</td>
            </tr>
            <tr></tr>
        </table>
    </td>
</template>

<style scoped>
.line-table {
    border-collapse: separate;
    border-spacing: 15px 2px;
}
</style>
