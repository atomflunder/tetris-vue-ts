<script setup lang="ts">
import { ref } from 'vue';
import TetrisGame from '@/components/TetrisGame.vue';

enum Menu {
    None,
    Marathon,
    Lines,
    Time
}

let menuChoice = ref(Menu.None);
</script>

<template>
    <nav class="navbar" v-if="menuChoice === Menu.None">
        <div class="header">SELECT GAME MODE:</div>
        <button class="menu-button" @click="menuChoice = Menu.Marathon">Marathon (Endless)</button>
        <button class="menu-button" @click="menuChoice = Menu.Lines">40 Lines</button>
        <button class="menu-button" @click="menuChoice = Menu.Time">2 Minutes Timed</button>
    </nav>

    <TetrisGame v-if="menuChoice === Menu.Marathon" :max-lines="null" :max-time="null" />
    <TetrisGame v-if="menuChoice === Menu.Lines" :max-lines="40" :max-time="null" />
    <TetrisGame v-if="menuChoice === Menu.Time" :max-lines="null" :max-time="120000" />
</template>

<style scoped>
.header {
    display: inline-flex;
    justify-content: center;
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
}

.menu-button:hover {
    background-color: #333;
    cursor: pointer;
    -webkit-box-shadow: 0 0 15px #aaa;
    box-shadow: 0 0 15px #aaa;
}
</style>
