<script setup lang="ts">
import { ref } from 'vue';
import TetrisGame from '@/components/TetrisGame.vue';
import { Menu } from './helpers/types';
import { getHighScore } from './helpers/score';
import { getMaxLines, getMaxTime } from './helpers/mode';

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
    </div>

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

.menu-button {
    display: inline-block;
    text-align: center;
    font-size: 20px;
    font-family: 'Press Start 2P';
    color: #ddd;
    background-color: #444;
    border: none;
    padding: 16px;
    -webkit-box-shadow: 0 0 15px #ddd;
    box-shadow: 0 0 15px #ddd;
    grid-column-start: 1;
}

.menu-button:hover {
    background-color: #333;
    cursor: pointer;
    -webkit-box-shadow: 0 0 15px #aaa;
    box-shadow: 0 0 15px #aaa;
}

.scores {
    grid-column-start: 2;
    font-size: 1.7rem;
    padding: 16px;
}
</style>
