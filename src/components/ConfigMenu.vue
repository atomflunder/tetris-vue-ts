<script setup lang="ts">
import { ref } from 'vue';
import { CONFIG, setConfig } from '../helpers/config';

defineEmits(['back']);

let debugInfo = ref(CONFIG.SHOW_DEBUG_INFO);
let coloredBoard = ref(CONFIG.COLORED_BOARD);
let lineClearDelay = ref(CONFIG.LINE_CLEAR_DELAY);
let modernPieceRNG = ref(CONFIG.MODERN_PIECE_RNG);
let pieceBagAmount = ref(CONFIG.PIECE_BAG_AMOUNT);
let firstPieceNoOverhang = ref(CONFIG.FIRST_PIECE_NO_OVERHANG);
let pieceLockTicks = ref(CONFIG.PIECE_LOCK_TICKS);
let lockMoveResets = ref(CONFIG.LOCK_MOVE_RESETS);

function resetConfig(): void {
    debugInfo.value = false;
    coloredBoard.value = true;
    lineClearDelay.value = 300;
    modernPieceRNG.value = true;
    pieceBagAmount.value = 1;
    firstPieceNoOverhang.value = true;
    pieceLockTicks.value = 30;
    lockMoveResets.value = 15;

    setConfig('SHOW_DEBUG_INFO', 'false');
    setConfig('COLORED_BOARD', 'true');
    setConfig('LINE_CLEAR_DELAY', '300');
    setConfig('MODERN_PIECE_RNG', 'true');
    setConfig('PIECE_BAG_AMOUNT', '1');
    setConfig('FIRST_PIECE_NO_OVERHANG', 'true');
    setConfig('PIECE_LOCK_TICKS', '30');
    setConfig('LOCK_MOVE_RESETS', '15');
}
</script>

<template>
    <div class="grid">
        <button class="menu-button back" @click="$emit('back')">BACK TO MENU</button>

        <table class="config-table">
            <td class="header" colspan="2">OPTIONS MENU</td>
            <tr>
                <td>SHOW DEBUG INFO:</td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="debugInfo"
                    @click="
                        setConfig(
                            'SHOW_DEBUG_INFO',
                            String(($event.target as HTMLInputElement).checked)
                        )
                    "
                />
            </tr>

            <tr>
                <td>COLORED BOARD:</td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="coloredBoard"
                    @click="
                        setConfig(
                            'COLORED_BOARD',
                            String(($event.target as HTMLInputElement).checked)
                        )
                    "
                />
            </tr>

            <tr>
                <td>LINE CLEAR DELAY:</td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="lineClearDelay"
                        min="0"
                        max="1000"
                        @change="
                            setConfig('LINE_CLEAR_DELAY', ($event.target as HTMLInputElement).value)
                        "
                    />
                    ({{ lineClearDelay }}MS)
                </td>
            </tr>

            <tr>
                <td>MODERN PIECE RNG:</td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="modernPieceRNG"
                    @click="
                        setConfig(
                            'MODERN_PIECE_RNG',
                            String(($event.target as HTMLInputElement).checked)
                        )
                    "
                />
            </tr>

            <tr>
                <td>PIECE BAGS:</td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="pieceBagAmount"
                        min="1"
                        max="10"
                        :disabled="!modernPieceRNG"
                        @change="
                            setConfig('PIECE_BAG_AMOUNT', ($event.target as HTMLInputElement).value)
                        "
                    />
                    ({{ pieceBagAmount }})
                </td>
            </tr>

            <tr>
                <td>PREVENT OVERHANGS:</td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="firstPieceNoOverhang"
                    :disabled="!modernPieceRNG"
                    @click="
                        setConfig(
                            'FIRST_PIECE_NO_OVERHANG',
                            String(($event.target as HTMLInputElement).checked)
                        )
                    "
                />
            </tr>

            <tr>
                <td>PIECE LOCK DELAY:</td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="pieceLockTicks"
                        min="0"
                        max="60"
                        @change="
                            setConfig('PIECE_LOCK_TICKS', ($event.target as HTMLInputElement).value)
                        "
                    />
                    ({{ pieceLockTicks }} / {{ Math.round((pieceLockTicks / 60) * 1000) }}MS)
                </td>
            </tr>

            <tr>
                <td>LOCK DELAY RESETS:</td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="lockMoveResets"
                        min="-1"
                        max="50"
                        @change="
                            setConfig('LOCK_MOVE_RESETS', ($event.target as HTMLInputElement).value)
                        "
                    />
                    ({{ lockMoveResets }})
                </td>
            </tr>

            <tr>
                <td>&nbsp;</td>
            </tr>

            <tr>
                <td>RESET TO DEFAULT</td>
                <td><button class="menu-button" @click="resetConfig">RESET TO DEFAULT</button></td>
            </tr>
        </table>
    </div>

    <div class="footer">OPTIONS WILL UPDATE ON PAGE REFRESH (F5)</div>
</template>

<style scoped>
.grid {
    display: flex;
    justify-content: center;
}

.header {
    display: flex;
    justify-content: center;
    font-size: 2.2rem;
}

.footer {
    display: flex;
    justify-content: center;
    font-size: 1.3rem;
}

.config-table {
    padding-top: 20px;
    padding-bottom: 20px;
}

.config-table td {
    padding-top: 10px;
    padding-bottom: 10px;
}

.config-table tr:hover {
    background-color: #222;
}

.back {
    position: absolute;
    right: 0%;
    top: 0%;
    margin-right: 10px;
    margin-top: 10px;
}

.box {
    background-color: #333;
    font-family: 'Press Start 2P';
    font-size: 1.5rem;
}

.box:hover {
    background-color: #444;
}

input[type='checkbox'] {
    -webkit-appearance: initial;
    appearance: initial;
    width: 3rem;
    height: 3rem;
    border: none;
    position: relative;
}

input[type='checkbox']:checked:after {
    content: 'X';
    color: #ddd;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.slider {
    appearance: none;
    background-color: #333;
    cursor: pointer;
}

.slider:hover {
    background-color: #444;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    background-color: #ddd;
    outline: none;
}

.slider::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    background-color: #ddd;
    outline: none;
}

.slider::-webkit-slider-thumb:hover {
    background-color: #eee;
}

.slider::-moz-range-thumb:hover {
    background-color: #eee;
}

*:disabled {
    opacity: 50%;
    cursor: not-allowed;
}
</style>
