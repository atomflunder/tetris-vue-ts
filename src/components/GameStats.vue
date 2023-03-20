<script setup lang="ts">
import type { Game } from '@/helpers/game';
import { SHOW_DEBUG_INFO } from '@/helpers/consts';
import { msToTimer } from '@/helpers/style';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <td colspan="4">
        <tr>
            SCORE:
            {{
                game.score
            }}
        </tr>
        <tr>
            LEVEL:
            {{
                game.level
            }}
        </tr>
        <tr>
            TIME:
            {{
                msToTimer(game.timer)
            }}
        </tr>
        <tr>
            &nbsp;
        </tr>
        <tr>
            COMBO:
            {{
                game.currentCombo + 1
            }}
        </tr>
        <tr>
            T-SPINS:
            {{
                game.tSpinCounter[0]
            }}
            /
            {{
                game.tSpinCounter[1]
            }}
        </tr>
        <tr>
            BACK-TO-BACK:
            {{
                game.lastDifficult
            }}
        </tr>

        <tr>
            &nbsp;
        </tr>

        <tr v-if="SHOW_DEBUG_INFO">
            DEBUG INFO:
        </tr>

        <tr v-if="SHOW_DEBUG_INFO">
            TICKS:
            {{
                game.ticks
            }}
        </tr>

        <tr v-if="SHOW_DEBUG_INFO">
            LAST MOVE:
            {{
                game.lastMove
            }}
        </tr>

        <tr v-if="SHOW_DEBUG_INFO">
            DROP:
            {{
                game.currentDrop
            }}
        </tr>

        <tr v-if="SHOW_DEBUG_INFO">
            LOCK INFO:
            {{
                game.lockMoveResets
            }}
            -
            {{
                Number(game.waitForLock)
            }}
            -
            {{
                game.lockTick
            }}
        </tr>
    </td>
</template>

<style scoped></style>
