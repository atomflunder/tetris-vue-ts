<script setup lang="ts">
import type { Game } from '@/helpers/game';

defineProps<{
    game: Game;
}>();
</script>

<template>
    TOTAL LINES:
    {{ game.totalLines }}
    <table class="line-table">
        <tr>
            <td class="small-block greyed-out"></td>
            <td class="small-block empty"></td>
            <td class="small-block empty"></td>
            <td class="small-block empty"></td>
            <td>SINGLE: {{ game.lineCounter[0] }}</td>
        </tr>
        <tr>
            <td class="small-block greyed-out"></td>
            <td class="small-block greyed-out"></td>
            <td class="small-block empty"></td>
            <td class="small-block empty"></td>
            <td>DOUBLE: {{ game.lineCounter[1] }}</td>
        </tr>
        <tr>
            <td class="small-block greyed-out"></td>
            <td class="small-block greyed-out"></td>
            <td class="small-block greyed-out"></td>
            <td class="small-block empty"></td>
            <td>TRIPLE: {{ game.lineCounter[2] }}</td>
        </tr>
        <tr>
            <td class="small-block greyed-out"></td>
            <td class="small-block greyed-out"></td>
            <td class="small-block greyed-out"></td>
            <td class="small-block greyed-out"></td>
            <td>TETRIS: {{ game.lineCounter[3] }}</td>
        </tr>
        <tr></tr>
    </table>
</template>

<style scoped>
.line-table {
    border-collapse: separate;
    border-spacing: 15px 2px;
}
</style>
