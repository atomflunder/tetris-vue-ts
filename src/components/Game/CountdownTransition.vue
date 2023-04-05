<script setup lang="ts">
defineProps<{
    count: number;
}>();
</script>

<template>
    <div>
        <Transition name="fade">
            <div class="countdown-number" v-if="count === 3">{{ count }}</div>
        </Transition>
        <Transition name="fade">
            <div class="countdown-number" v-if="count === 2">{{ count }}</div>
        </Transition>
        <Transition name="fade">
            <div class="countdown-number" v-if="count === 1">{{ count }}</div>
        </Transition>
        <Transition name="fade">
            <div class="countdown-start" v-if="count === 0">START!</div>
        </Transition>
    </div>
</template>

<style scoped>
.countdown-number {
    color: #fff;
    font-size: 3rem;
    margin-top: 150px;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
    position: fixed;
    margin-left: 150px;
}

.countdown-start {
    color: #fff;
    font-size: 2rem;
    margin-top: 160px;
    text-shadow: -1px 0 black 1px 0 black 1px 0 black -1px 0 black;
    position: fixed;
    margin-left: 70px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
