<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { SHOW_DEBUG_INFO } from '@/helpers/config';
import { msToTimer } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <div>
        SCORE:
        {{ game.score }}
    </div>
    <div>
        LEVEL:
        {{ game.level }}
    </div>
    <div>
        TIME:
        {{ msToTimer(game.timer) }}
    </div>
    <div>&nbsp;</div>
    <div>
        COMBO:
        {{ game.currentCombo + 1 }}
    </div>
    <div>
        T-SPINS:
        {{ game.tSpinCounter[0] }}
        /
        {{ game.tSpinCounter[1] }}
    </div>
    <div>
        BACK-TO-BACK:
        {{ game.lastDifficult }}
    </div>

    <div>&nbsp;</div>

    <div v-if="SHOW_DEBUG_INFO">DEBUG INFO:</div>

    <div v-if="SHOW_DEBUG_INFO">
        TICKS:
        {{ game.ticks }}
    </div>

    <div v-if="SHOW_DEBUG_INFO">
        LAST MOVE:
        {{ game.lastMove }}
    </div>

    <div v-if="SHOW_DEBUG_INFO">
        DROP:
        {{ game.currentDrop }}
    </div>

    <div v-if="SHOW_DEBUG_INFO">
        LOCK INFO:
        {{ game.lockMoveResets }}
        -
        {{ Number(game.waitForLock) }}
        -
        {{ game.lockTick }}
    </div>
</template>

<style scoped></style>
