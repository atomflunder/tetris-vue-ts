<script setup lang="ts">
import { CONTROLS, setKeybind } from '../helpers/controls';
import { keyToDisplay } from '@/helpers/style';
import { ref } from 'vue';

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
let holdPiece = ref(CONTROLS.HOLD_PIECE);
let insertGarbage = ref(CONTROLS.INSERT_GARBAGE);

function resetKeybinds(): void {
    pauseGame.value = 'Escape';
    resetGame.value = 'Enter';
    backToMenu.value = 'Escape';
    moveLeft.value = 'ArrowLeft';
    moveRight.value = 'ArrowRight';
    softDrop.value = 'ArrowDown';
    hardDrop.value = 'ArrowUp';
    rotateCW.value = ' ';
    rotateCCW.value = 'Enter';
    holdPiece.value = '0';
    insertGarbage.value = 'F1';

    setKeybind('PAUSE_GAME', 'Escape');
    setKeybind('RESET_GAME', 'Enter');
    setKeybind('BACK_TO_MENU', 'Escape');
    setKeybind('MOVE_LEFT', 'ArrowLeft');
    setKeybind('MOVE_RIGHT', 'ArrowRight');
    setKeybind('SOFT_DROP', 'ArrowDown');
    setKeybind('HARD_DROP', 'ArrowUp');
    setKeybind('ROTATE_CW', ' ');
    setKeybind('ROTATE_CCW', 'Enter');
    setKeybind('HOLD_PIECE', '0');
    setKeybind('INSERT_GARBAGE', 'F1');
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
        <button class="menu-button back" @click="$emit('back')">Back to Menu</button>

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
                        {{ keyToDisplay(moveLeft) }}
                    </button>
                </td>

                <td>PAUSE GAME:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="PAUSE_GAME"
                        @click="rebindKey('PAUSE_GAME')"
                    >
                        {{ keyToDisplay(pauseGame) }}
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
                        {{ keyToDisplay(moveRight) }}
                    </button>
                </td>

                <td>RESET GAME:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="RESET_GAME"
                        @click="rebindKey('RESET_GAME')"
                    >
                        {{ keyToDisplay(resetGame) }}
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
                        {{ keyToDisplay(softDrop) }}
                    </button>
                </td>

                <td>BACK TO MENU:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="BACK_TO_MENU"
                        @click="rebindKey('BACK_TO_MENU')"
                    >
                        {{ keyToDisplay(backToMenu) }}
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
                        {{ keyToDisplay(hardDrop) }}
                    </button>
                </td>

                <td>HOLD PIECE:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="HOLD_PIECE"
                        @click="rebindKey('HOLD_PIECE')"
                    >
                        {{ keyToDisplay(holdPiece) }}
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
                        {{ keyToDisplay(rotateCW) }}
                    </button>
                </td>

                <td>INSERT GARBAGE:</td>
                <td>
                    <button
                        class="menu-button fixed-size"
                        id="INSERT_GARBAGE"
                        @click="rebindKey('INSERT_GARBAGE')"
                    >
                        {{ keyToDisplay(insertGarbage) }}
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
                        {{ keyToDisplay(rotateCCW) }}
                    </button>
                </td>
            </tr>

            <tr>
                <td colspan="2">RESET TO DEFAULT</td>
                <td colspan="2">
                    <button class="menu-button" @click="resetKeybinds">RESET TO DEFAULT</button>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">KEYBINDS WILL UPDATE ON PAGE REFRESH (F5)</div>
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
