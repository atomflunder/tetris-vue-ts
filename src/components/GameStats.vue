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
    </td>
</template>

<style scoped></style>
