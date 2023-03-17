<script setup lang="ts">
import type { Game } from '@/helpers/game';

defineProps<{
    game: Game;
}>();
</script>

<template>
    <td>SCORE: {{ game.score }}</td>
    <td>LEVEL: {{ game.level }}</td>
</template>

<style scoped></style>
