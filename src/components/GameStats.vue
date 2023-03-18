<script setup lang="ts">
import type { Game } from '@/helpers/game';

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
    </td>
</template>

<style scoped></style>
