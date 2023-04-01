<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { CONFIG } from '@/helpers/config';

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
        {{ game.timer.toReadableTime() }}
    </div>
    <div>&nbsp;</div>
    <div>
        COMBO:
        {{ game.currentCombo + 1 }}
    </div>
    <div>
        BACK-TO-BACK:
        {{ game.backToBack < 0 ? 0 : game.backToBack }}
    </div>
    <div>
        T-SPINS:
        {{ game.tSpinCountList[0] }}
        /
        {{ game.tSpinCountList[1] }}
    </div>

    <div>&nbsp;</div>

    <div v-if="CONFIG.SHOW_DEBUG_INFO.value">
        DEBUG INFO:
        <div>
            TICKS:
            {{ game.ticks }}
        </div>

        <div>
            FROZEN:
            {{ game.frozen }}
        </div>

        <div>
            LAST MOVE:
            {{ game.lastMove }}
        </div>

        <div>
            DROP:
            {{ game.currentDrop }}
        </div>

        <div>
            LOCK INFO:
            <div class="indented">WAITING: {{ game.waitForLock }}</div>
            <div class="indented">MOVES: {{ game.lockMoveResets }}</div>
            <div class="indented">TICKS: {{ game.lockTicksRemaining }}</div>
        </div>

        <div>
            KEY EVENTS:
            <div class="indented">L: {{ game.keyEvents['ArrowLeft'] || 0 }}</div>
            <div class="indented">R: {{ game.keyEvents['ArrowRight'] || 0 }}</div>
            <div class="indented">D: {{ game.keyEvents['ArrowDown'] || 0 }}</div>
        </div>
    </div>
</template>

<style scoped>
.indented {
    margin-left: 50px;
}
</style>
