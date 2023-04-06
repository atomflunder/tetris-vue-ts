<script setup lang="ts">
import { CONTROLS } from '@/helpers/controls';
import { keyToDisplay } from '@/helpers/style';
</script>

<template>
    <div class="keyboard-controls">
        <div class="header">CONTROLS:</div>

        <div class="label-move">MOVE LEFT / RIGHT:</div>
        <div class="button-move">
            {{ keyToDisplay(CONTROLS.MOVE_LEFT.value).toUpperCase() }} /
            {{ keyToDisplay(CONTROLS.MOVE_RIGHT.value).toUpperCase() }}
        </div>

        <div class="label-drop">SOFT / HARD DROP:</div>
        <div class="button-drop">
            {{ keyToDisplay(CONTROLS.SOFT_DROP.value).toUpperCase() }} /
            {{ keyToDisplay(CONTROLS.HARD_DROP.value).toUpperCase() }}
        </div>

        <div class="label-rotate">ROTATE CW / CCW / 180:</div>
        <div class="button-rotate">
            {{ keyToDisplay(CONTROLS.ROTATE_CW.value).toUpperCase() }} /
            {{ keyToDisplay(CONTROLS.ROTATE_CCW.value).toUpperCase() }} /
            {{ keyToDisplay(CONTROLS.ROTATE_180.value).toUpperCase() }}
        </div>

        <div class="label-hold">HOLD PIECE:</div>
        <div class="button-hold">{{ keyToDisplay(CONTROLS.HOLD_PIECE.value).toUpperCase() }}</div>

        <div class="label-garbage">INSERT GARBAGE:</div>
        <div class="button-garbage">
            {{ keyToDisplay(CONTROLS.INSERT_GARBAGE.value).toUpperCase() }}
        </div>
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
