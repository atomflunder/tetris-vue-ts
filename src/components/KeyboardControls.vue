<script setup lang="ts">
import { CONTROLS } from '@/helpers/consts';

/**
 * Displaying some commonly and default used keys to be visually more appealing.
 */
function keyToDisplay(key: string): string {
    switch (key) {
        case ' ':
            return 'SPACE';
        case 'ArrowLeft':
            return '◀';
        case 'ArrowRight':
            return '▶';
        case 'ArrowDown':
            return '▼';
        case 'ArrowUp':
            return '▲';

        default:
            return '';
    }
}
</script>

<template>
    CONTROLS:
    <tr>
        &nbsp;
    </tr>
    <table class="keyboard-controls">
        <tr>
            <td>MOVE LEFT / RIGHT:</td>
            <td>
                {{ keyToDisplay(CONTROLS.MOVE_LEFT) }} / {{ keyToDisplay(CONTROLS.MOVE_RIGHT) }}
            </td>
        </tr>
        <tr>
            <td>SOFT / HARD DROP:</td>
            <td>{{ keyToDisplay(CONTROLS.SOFT_DROP) }} / {{ keyToDisplay(CONTROLS.HARD_DROP) }}</td>
        </tr>
        <tr>
            <td>ROTATE CW / CCW:</td>
            <td>
                {{ keyToDisplay(CONTROLS.ROTATE_CW) }} / {{ CONTROLS.ROTATE_CCW.toUpperCase() }}
            </td>
        </tr>
        <tr>
            <td>HOLD PIECE:</td>
            <td>{{ CONTROLS.HOLD_PIECE.toUpperCase() }}</td>
        </tr>
        <tr>
            <td>INSERT GARBAGE:</td>
            <td>{{ CONTROLS.INSERT_GARBAGE.toUpperCase() }}</td>
        </tr>
    </table>
</template>

<style scoped>
.keyboard-controls {
    border-spacing: 10px 30px;
}
</style>
