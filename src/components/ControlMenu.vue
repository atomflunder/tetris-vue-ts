<script setup lang="ts">
import { keyToDisplay } from '@/helpers/style';
import { ref } from 'vue';
import { CONTROLS, setKeybind } from '../helpers/controls';

defineEmits(['back']);

let pauseGame = ref(CONTROLS.PAUSE_GAME);
let resetGame = ref(CONTROLS.RESET_GAME);
let backToMenu = ref(CONTROLS.BACK_TO_MENU);
let moveLeft = ref(CONTROLS.MOVE_LEFT);
let moveRight = ref(CONTROLS.MOVE_RIGHT);
let softDrop = ref(CONTROLS.SOFT_DROP);
let hardDrop = ref(CONTROLS.HARD_DROP);
let rotateCW = ref(CONTROLS.ROTATE_CW);
let rotateCCW = ref(CONTROLS.ROTATE_CCW);
let rotate180 = ref(CONTROLS.ROTATE_180);
let holdPiece = ref(CONTROLS.HOLD_PIECE);
let insertGarbage = ref(CONTROLS.INSERT_GARBAGE);

function resetKeybinds(): void {
    const allValues = [
        pauseGame,
        resetGame,
        backToMenu,
        moveLeft,
        moveRight,
        softDrop,
        hardDrop,
        rotateCW,
        rotateCCW,
        rotate180,
        holdPiece,
        insertGarbage
    ];

    for (let i = 0; i < allValues.length; i++) {
        allValues[i].value.value = allValues[i].value.defaultValue;
        setKeybind(allValues[i].value.name, allValues[i].value.defaultValue);
    }
}

async function rebindKey(keybind: string): Promise<void> {
    const button = document.getElementById(keybind);

    if (!button) {
        return;
    }

    button.textContent = 'PRESS ANY KEY...';

    function waitForKeypress(): Promise<KeyboardEvent> {
        return new Promise((resolve) => {
            document.addEventListener('keydown', onKeyHandler);
            function onKeyHandler(e: KeyboardEvent): void {
                e.preventDefault();
                document.removeEventListener('keydown', onKeyHandler);
                setKeybind(keybind, e.key);
                resolve(e);
            }
        });
    }

    const e = await waitForKeypress();

    button.textContent = keyToDisplay(e.key);
}
</script>

<template>
    <div class="grid">
        <button class="menu-button back" @click="$emit('back')">BACK TO MENU</button>

        <table class="config-table">
            <td class="header" colspan="4">KEYBIND MENU</td>

            <tr>
                <td>MOVE LEFT:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="MOVE_LEFT"
                        @click="rebindKey('MOVE_LEFT')"
                    >
                        {{ keyToDisplay(moveLeft.value) }}
                    </button>
                </td>

                <td>PAUSE GAME:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="PAUSE_GAME"
                        @click="rebindKey('PAUSE_GAME')"
                    >
                        {{ keyToDisplay(pauseGame.value) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td>MOVE RIGHT:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="MOVE_RIGHT"
                        @click="rebindKey('MOVE_RIGHT')"
                    >
                        {{ keyToDisplay(moveRight.value) }}
                    </button>
                </td>

                <td>RESET GAME:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="RESET_GAME"
                        @click="rebindKey('RESET_GAME')"
                    >
                        {{ keyToDisplay(resetGame.value) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td>SOFT DROP:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="SOFT_DROP"
                        @click="rebindKey('SOFT_DROP')"
                    >
                        {{ keyToDisplay(softDrop.value) }}
                    </button>
                </td>

                <td>BACK TO MENU:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="BACK_TO_MENU"
                        @click="rebindKey('BACK_TO_MENU')"
                    >
                        {{ keyToDisplay(backToMenu.value) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td>HARD DROP:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="HARD_DROP"
                        @click="rebindKey('HARD_DROP')"
                    >
                        {{ keyToDisplay(hardDrop.value) }}
                    </button>
                </td>

                <td>HOLD PIECE:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="HOLD_PIECE"
                        @click="rebindKey('HOLD_PIECE')"
                    >
                        {{ keyToDisplay(holdPiece.value) }}
                    </button>
                </td>
            </tr>
            <tr>
                <td>ROTATE CLOCKWISE:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="ROTATE_CW"
                        @click="rebindKey('ROTATE_CW')"
                    >
                        {{ keyToDisplay(rotateCW.value) }}
                    </button>
                </td>

                <td>INSERT GARBAGE:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="INSERT_GARBAGE"
                        @click="rebindKey('INSERT_GARBAGE')"
                    >
                        {{ keyToDisplay(insertGarbage.value) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td>ROTATE COUNTER-CLOCKWISE:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="ROTATE_CCW"
                        @click="rebindKey('ROTATE_CCW')"
                    >
                        {{ keyToDisplay(rotateCCW.value) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td>ROTATE 180°:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="ROTATE_180"
                        @click="rebindKey('ROTATE_180')"
                    >
                        {{ keyToDisplay(rotate180.value) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td>&nbsp;</td>
            </tr>

            <tr>
                <td colspan="2">RESET TO DEFAULT</td>
                <td colspan="2">
                    <button class="menu-button" @click="resetKeybinds">RESET TO DEFAULT</button>
                </td>
            </tr>
        </table>
    </div>
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

.config-table {
    padding-top: 20px;
    padding-bottom: 20px;
}

.config-table td {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
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

.fixed-size {
    width: 200px;
}
</style>
