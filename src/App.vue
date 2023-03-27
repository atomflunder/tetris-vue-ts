<script setup lang="ts">
import { ref } from 'vue';
import TetrisGame from '@/components/TetrisGame.vue';
import ConfigMenu from '@/components/ConfigMenu.vue';
import { Menu } from './helpers/types';
import { getHighScore } from './helpers/score';
import { getMaxLines, getMaxTime } from './helpers/mode';
import ControlMenu from './components/ControlMenu.vue';

let menuChoice = ref(Menu.None);
</script>

<template>
    <div class="navbar" v-if="menuChoice === Menu.None">
        <div class="header">SELECT GAME MODE:</div>
        <div class="header">HIGH SCORES:</div>

        <button class="menu-button" @click="menuChoice = Menu.Endless">Endless</button>
        <div class="scores">{{ getHighScore(Menu.Endless) }}</div>

        <button class="menu-button" @click="menuChoice = Menu.Marathon">
            Marathon (150 Lines)
        </button>
        <div class="scores">{{ getHighScore(Menu.Marathon) }}</div>

        <button class="menu-button" @click="menuChoice = Menu.Sprint">Sprint (40 Lines)</button>
        <div class="scores">{{ getHighScore(Menu.Sprint) }}</div>

        <button class="menu-button" @click="menuChoice = Menu.Time">3 Minutes Timed</button>
        <div class="scores">{{ getHighScore(Menu.Time) }}</div>

        <div class="options">
            <button class="menu-button" @click="menuChoice = Menu.Config">Config Options</button>
            <button class="menu-button" @click="menuChoice = Menu.Control">Keybind Options</button>
        </div>
    </div>

    <ConfigMenu v-else-if="menuChoice === Menu.Config" @back="menuChoice = Menu.None" />
    <ControlMenu v-else-if="menuChoice === Menu.Control" @back="menuChoice = Menu.None" />

    <TetrisGame
        v-else
        :gameMode="menuChoice"
        :max-lines="getMaxLines(menuChoice)"
        :max-time="getMaxTime(menuChoice)"
        @back-to-menu="menuChoice = Menu.None"
    />
</template>

<style scoped>
.header {
    display: inline-flex;
    justify-content: center;
    grid-row-start: 1;
}

.navbar {
    display: grid;
    justify-content: center;
    padding: 4rem;
    gap: 2rem;
}

.options {
    position: absolute;
    right: 0%;
    top: 0%;
    margin-right: 10px;
    margin-top: 10px;
    clear: right;
    display: grid;
    row-gap: 1rem;
}

.scores {
    grid-column-start: 2;
    font-size: 1.7rem;
    padding: 16px;
}

@media (max-width: 1700px) {
    .options {
        position: relative;
    }
}
</style>
