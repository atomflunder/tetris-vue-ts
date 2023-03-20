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
    <div class="keyboard-controls">
        <div class="header">CONTROLS:</div>

        <div class="label-move">MOVE LEFT / RIGHT:</div>
        <div class="button-move">
            {{ keyToDisplay(CONTROLS.MOVE_LEFT) }} / {{ keyToDisplay(CONTROLS.MOVE_RIGHT) }}
        </div>

        <div class="label-drop">SOFT / HARD DROP:</div>
        <div class="button-drop">
            {{ keyToDisplay(CONTROLS.SOFT_DROP) }} / {{ keyToDisplay(CONTROLS.HARD_DROP) }}
        </div>

        <div class="label-rotate">ROTATE CW / CCW:</div>
        <div class="button-rotate">
            {{ keyToDisplay(CONTROLS.ROTATE_CW) }} / {{ CONTROLS.ROTATE_CCW.toUpperCase() }}
        </div>

        <div class="label-hold">HOLD PIECE:</div>
        <div class="button-hold">{{ CONTROLS.HOLD_PIECE.toUpperCase() }}</div>

        <div class="label-garbage">INSERT GARBAGE:</div>
        <div class="button-garbage">{{ CONTROLS.INSERT_GARBAGE.toUpperCase() }}</div>
    </div>
</template>

<style scoped>
.keyboard-controls {
    display: grid;
    justify-content: center;
    gap: 1rem 1rem;
}

.header {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
}

.label-move {
    grid-column-start: 1;
    grid-row-start: 2;
}

.button-move {
    grid-column-start: 2;
    grid-row-start: 2;
}

.label-drop {
    grid-column-start: 1;
    grid-row-start: 3;
}

.button-drop {
    grid-column-start: 2;
    grid-row-start: 3;
}

.label-rotate {
    grid-column-start: 1;
    grid-row-start: 4;
}

.button-rotate {
    grid-column-start: 2;
    grid-row-start: 4;
}

.label-hold {
    grid-column-start: 1;
    grid-row-start: 5;
}

.button-hold {
    grid-column-start: 2;
    grid-row-start: 5;
}

.label-garbage {
    grid-column-start: 1;
    grid-row-start: 6;
}

.button-garbage {
    grid-column-start: 2;
    grid-row-start: 6;
}
</style>
