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

function setMenu(choice: Menu) {
    menuChoice.value = choice;
    console.log(menuChoice);
}
</script>

<template>
    <nav v-if="menuChoice === Menu.None">
        <button @click="setMenu(Menu.Marathon)">Marathon</button>
        <button @click="setMenu(Menu.Lines)">40 Lines</button>
        <button @click="setMenu(Menu.Time)">Time</button>
    </nav>

    <TetrisGame v-if="menuChoice === Menu.Marathon" :max-lines="null" :max-time="null" />
    <TetrisGame v-if="menuChoice === Menu.Lines" :max-lines="40" :max-time="null" />
    <TetrisGame v-if="menuChoice === Menu.Time" :max-lines="null" :max-time="1200" />
</template>

<style scoped></style>
