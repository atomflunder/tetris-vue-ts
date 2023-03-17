<script setup lang="ts">
import type { Game } from '@/helpers/game';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <td>Score: {{ game.score }}</td>
    <td>Level: {{ game.level }}</td>
</template>

<style scoped></style>
