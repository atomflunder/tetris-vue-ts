<script setup lang="ts">
import { ref } from 'vue';
import TetrisGame from '@/components/TetrisGame.vue';
import ConfigMenu from '@/components/ConfigMenu.vue';
import { Menu } from './helpers/types';
import { getHighScore } from './helpers/score';
import { getMaxLines, getMaxTime } from './helpers/mode';
import ControlMenu from './components/ControlMenu.vue';
import TotalStats from './components/TotalStats.vue';

let menuChoice = ref(Menu.None);

let levelSelect = ref(1);
</script>

<template>
    <div class="navbar" v-if="menuChoice === Menu.None">
        <div class="header">SELECT GAME MODE:</div>
        <div class="header">HIGH SCORES:</div>

        <button class="menu-button" @click="menuChoice = Menu.Endless">ENDLESS</button>
        <div class="scores">{{ getHighScore(Menu.Endless) }}</div>

        <button class="menu-button" @click="menuChoice = Menu.Marathon">
            MARATHON (150 LINES)
        </button>
        <div class="scores">{{ getHighScore(Menu.Marathon) }}</div>

        <button class="menu-button" @click="menuChoice = Menu.Sprint">SPRINT (40 LINES)</button>
        <div class="scores">{{ getHighScore(Menu.Sprint) }}</div>

        <button class="menu-button" @click="menuChoice = Menu.Time">ULTRA (3:00 MINUTES)</button>
        <div class="scores">{{ getHighScore(Menu.Time) }}</div>

        <div class="options">
            <button class="menu-button" @click="menuChoice = Menu.Config">CONFIG OPTIONS</button>
            <button class="menu-button" @click="menuChoice = Menu.Control">KEYBIND OPTIONS</button>
            <button class="menu-button" @click="menuChoice = Menu.Stats">LIFETIME STATS</button>
        </div>

        <div class="level">
            LEVEL SELECT:
            <select
                name="level-select"
                id="level-select"
                v-model="levelSelect"
                class="level-select"
            >
                <option v-for="i in 20" :value="i" :key="i" style="font-family: 'Consolas'">
                    {{ i.toString().padStart(2, '0') }}
                </option>
            </select>
        </div>
    </div>

    <ConfigMenu v-else-if="menuChoice === Menu.Config" @back="menuChoice = Menu.None" />
    <ControlMenu v-else-if="menuChoice === Menu.Control" @back="menuChoice = Menu.None" />
    <TotalStats v-else-if="menuChoice === Menu.Stats" @back="menuChoice = Menu.None" />

    <TetrisGame
        v-else
        :gameMode="menuChoice"
        :max-lines="getMaxLines(menuChoice)"
        :max-time="getMaxTime(menuChoice)"
        :start-level="levelSelect"
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

.level {
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
    grid-row-start: 6;
}

.level:hover {
    background-color: #333;
    -webkit-box-shadow: 0 0 15px #aaa;
    box-shadow: 0 0 15px #aaa;
}

.level-select {
    text-align: center;
    font-size: 20px;
    font-family: 'Press Start 2P';
    color: #ddd;
    background-color: #444;
    border: none;
    border-radius: 2px;
    padding: 8px;
}

.level-select:hover {
    background-color: #333;
    cursor: pointer;
}

@media (max-width: 1700px) {
    .options {
        position: relative;
    }
}
</style>
