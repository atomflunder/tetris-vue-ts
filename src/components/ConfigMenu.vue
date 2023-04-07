<script setup lang="ts">
import { ref } from 'vue';
import { CONFIG, setConfig } from '../helpers/config';
import { getColorClass } from '@/helpers/style';
import { Game } from '@/helpers/game';
import { allPieces } from '@/helpers/pieceData';

defineEmits<{
    (event: 'back'): void;
    (event: 'changebg', newBackground: string): void;
}>();

let volume = ref(CONFIG.VOLUME);
let debugInfo = ref(CONFIG.SHOW_DEBUG_INFO);
let coloredBoard = ref(CONFIG.COLORED_BOARD);
let ghostPiece = ref(CONFIG.GHOST_PIECE);
let lineClearDelay = ref(CONFIG.LINE_CLEAR_DELAY);
let modernPieceRNG = ref(CONFIG.MODERN_PIECE_RNG);
let pieceBagAmount = ref(CONFIG.PIECE_BAG_AMOUNT);
let firstPieceNoOverhang = ref(CONFIG.FIRST_PIECE_NO_OVERHANG);
let pieceLockTicks = ref(CONFIG.PIECE_LOCK_TICKS);
let lockMoveResets = ref(CONFIG.LOCK_MOVE_RESETS);
let dasDelay = ref(CONFIG.DAS_DELAY);
let arrSpeed = ref(CONFIG.ARR_SPEED);
let backgroundURL = ref(CONFIG.BACKGROUND_URL);

function getPreviewGame(greyedOut: boolean): Game {
    const dummyGame = new Game();

    if (greyedOut) {
        dummyGame.board.GameBoard[22] = [1, 2, 2, 2, 5, 5, 7, 7, 7, 0];
        dummyGame.board.GameBoard[21] = [1, 2, 3, 3, 3, 5, 5, 7, 2, 0];
        dummyGame.board.GameBoard[20] = [1, 4, 4, 6, 3, 0, 2, 2, 2, 0];
        dummyGame.board.GameBoard[19] = [1, 4, 4, 6, 6, 0, 6, 5, 5, 0];
        dummyGame.board.GameBoard[18] = [4, 4, 3, 0, 6, 0, 6, 6, 5, 5];
        dummyGame.board.GameBoard[17] = [4, 4, 3, 0, 0, 0, 0, 6, 0, 0];
        dummyGame.board.GameBoard[16] = [1, 3, 3, 0, 0, 0, 0, 0, 0, 0];
        dummyGame.board.GameBoard[15] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        dummyGame.board.GameBoard[14] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        dummyGame.board.GameBoard[13] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    } else {
        dummyGame.board.GameBoard[22] = [8, 8, 8, 8, 8, 8, 8, 8, 8, 0];
        dummyGame.board.GameBoard[21] = [8, 8, 8, 8, 8, 8, 8, 8, 8, 0];
        dummyGame.board.GameBoard[20] = [8, 8, 8, 8, 8, 0, 8, 8, 8, 0];
        dummyGame.board.GameBoard[19] = [8, 8, 8, 8, 8, 0, 8, 8, 8, 0];
        dummyGame.board.GameBoard[18] = [8, 8, 8, 0, 8, 0, 8, 8, 8, 8];
        dummyGame.board.GameBoard[17] = [8, 8, 8, 0, 0, 0, 0, 8, 0, 0];
        dummyGame.board.GameBoard[16] = [8, 8, 8, 0, 0, 0, 0, 0, 0, 0];
        dummyGame.board.GameBoard[15] = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        dummyGame.board.GameBoard[14] = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        dummyGame.board.GameBoard[13] = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    dummyGame.board.GameBoard[9] = [0, 0, 0, 7, 7, 7, 0, 0, 0, 0];
    dummyGame.board.GameBoard[8] = [0, 0, 0, 0, 7, 0, 0, 0, 0, 0];

    dummyGame.board.GameBoard[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dummyGame.board.GameBoard[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dummyGame.board.GameBoard[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    dummyGame.currentPiece = allPieces[6];
    dummyGame.currentPiece.offset = [10, 3];

    dummyGame.shadowPiece = dummyGame.currentPiece.getShadowCoordinates(dummyGame.board);

    return dummyGame;
}

let dummyGame = ref(getPreviewGame(CONFIG.COLORED_BOARD.value));

function resetConfig(): void {
    const allValues = [
        volume,
        debugInfo,
        coloredBoard,
        ghostPiece,
        lineClearDelay,
        modernPieceRNG,
        pieceBagAmount,
        firstPieceNoOverhang,
        pieceLockTicks,
        lockMoveResets,
        dasDelay,
        arrSpeed,
        backgroundURL
    ];

    for (let i = 0; i < allValues.length; i++) {
        if (typeof allValues[i].value.value === 'boolean') {
            allValues[i].value.value = allValues[i].value.defaultValue === 'true';
            setConfig(allValues[i].value.name, allValues[i].value.defaultValue, true);
        } else if (typeof allValues[i].value.value === 'number') {
            allValues[i].value.value = Number(allValues[i].value.defaultValue);
            setConfig(allValues[i].value.name, allValues[i].value.defaultValue, false);
        } else {
            allValues[i].value.value = allValues[i].value.defaultValue;
            setConfig(allValues[i].value.name, allValues[i].value.defaultValue, false, true);
        }
    }

    dummyGame.value = getPreviewGame(false);
}
</script>

<template>
    <div class="grid">
        <button class="menu-button back" @click="$emit('back')">BACK TO MENU</button>

        <table class="config-table">
            <td class="header" colspan="2">OPTIONS MENU</td>
            <tr>
                <td title="The volume of the sound effects playing.">VOLUME:</td>
                <input
                    class="slider"
                    type="range"
                    v-model="volume.value"
                    min="0"
                    max="1"
                    step="0.01"
                    @change="
                        {
                            setConfig('VOLUME', ($event.target as HTMLInputElement).value, false);
                            dummyGame.audioPlayer.playSound('hardDrop');
                        }
                    "
                />
                ({{
                    Math.round(volume.value * 100)
                }}%)
            </tr>

            <tr>
                <td title="Shows some debug information on screen, used for development.">
                    SHOW DEBUG INFO:
                </td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="debugInfo.value"
                    @click="
                        setConfig(
                            'SHOW_DEBUG_INFO',
                            String(($event.target as HTMLInputElement).checked),
                            true
                        )
                    "
                />
            </tr>

            <tr>
                <td
                    title="If you want the pieces to stay their color when dropped. If disabled, they will be greyed out on impact."
                >
                    COLORED BOARD:
                </td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="coloredBoard.value"
                    @click="
                        {
                            setConfig(
                                'COLORED_BOARD',
                                String(($event.target as HTMLInputElement).checked),
                                true
                            );
                            dummyGame = getPreviewGame(CONFIG.COLORED_BOARD.value);
                        }
                    "
                />
            </tr>

            <tr>
                <td
                    title="If you want to enable a 'ghost piece' that shows up on the bottom of the screen showing you where the current piece will end up."
                >
                    GHOST PIECE:
                </td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="ghostPiece.value"
                    @click="
                        {
                            setConfig(
                                'GHOST_PIECE',
                                String(($event.target as HTMLInputElement).checked),
                                true
                            );
                            dummyGame = getPreviewGame(CONFIG.COLORED_BOARD.value);
                        }
                    "
                />
            </tr>

            <tr>
                <td
                    title="The delay in milliseconds that the game will 'freeze' for when you clear a line."
                >
                    LINE CLEAR DELAY:
                </td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="lineClearDelay.value"
                        min="0"
                        max="1000"
                        step="1"
                        @change="
                            setConfig(
                                'LINE_CLEAR_DELAY',
                                ($event.target as HTMLInputElement).value,
                                false
                            )
                        "
                    />
                    ({{ lineClearDelay.value }}MS)
                </td>
            </tr>

            <tr>
                <td
                    title="In the modern piece RNG, the game will generate a bag with X times each of the 7 pieces and shuffles it randomly. 
This means that you cannot go more than X * 12 pieces in a row without seeing a specific piece and you cannot see a piece more than X * 2 times in a row.
If disabled, the pieces will be truly random."
                >
                    MODERN PIECE RNG:
                </td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="modernPieceRNG.value"
                    @click="
                        // Not sure why I have to do this here, but the disabled property would not update on the boxed below otherwise.
                        modernPieceRNG.value = ($event.target as HTMLInputElement).checked;
                        setConfig(
                            'MODERN_PIECE_RNG',
                            String(($event.target as HTMLInputElement).checked),
                            true
                        );
                    "
                />
            </tr>

            <tr>
                <td
                    title="The amount of piece bags generated at once. Only available with modern piece RNG."
                >
                    PIECE BAGS:
                </td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="pieceBagAmount.value"
                        min="1"
                        max="10"
                        step="1"
                        :disabled="!modernPieceRNG.value"
                        @change="
                            setConfig(
                                'PIECE_BAG_AMOUNT',
                                ($event.target as HTMLInputElement).value,
                                false
                            )
                        "
                    />
                    ({{ pieceBagAmount.value }})
                </td>
            </tr>

            <tr>
                <td
                    title="If enabled, the first piece spawned will never be a S, Z or O. Only available with modern piece RNG."
                >
                    PREVENT OVERHANGS:
                </td>
                <input
                    class="box"
                    type="checkbox"
                    v-model="firstPieceNoOverhang.value"
                    :disabled="!modernPieceRNG.value"
                    @click="
                        setConfig(
                            'FIRST_PIECE_NO_OVERHANG',
                            String(($event.target as HTMLInputElement).checked),
                            true
                        )
                    "
                />
            </tr>

            <tr>
                <td title="The amount of time before a piece locks when falling down.">
                    PIECE LOCK DELAY:
                </td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="pieceLockTicks.value"
                        min="0"
                        max="60"
                        step="1"
                        @change="
                            setConfig(
                                'PIECE_LOCK_TICKS',
                                ($event.target as HTMLInputElement).value,
                                false
                            )
                        "
                    />
                    ({{ Math.round((pieceLockTicks.value / 60) * 1000) }}MS)
                </td>
            </tr>

            <tr>
                <td
                    title="The amount of moves that reset the lock delay. Set this to -1 for an infinite amount of resets."
                >
                    LOCK DELAY RESETS:
                </td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="lockMoveResets.value"
                        min="-1"
                        max="50"
                        step="1"
                        @change="
                            setConfig(
                                'LOCK_MOVE_RESETS',
                                ($event.target as HTMLInputElement).value,
                                false
                            )
                        "
                    />
                    ({{ lockMoveResets.value }})
                </td>
            </tr>

            <tr>
                <td title="The delay between the initial keypress and the ARR kicking in.">
                    DELAYED AUTO SHIFT (DAS):
                </td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="dasDelay.value"
                        min="0"
                        max="1000"
                        step="1"
                        @change="
                            setConfig('DAS_DELAY', ($event.target as HTMLInputElement).value, false)
                        "
                    />
                    ({{ dasDelay.value }}MS)
                </td>
            </tr>

            <tr>
                <td title="The speed of the tetrominoes moving when holding down a movement key.">
                    AUTOMATIC REPEAT RATE (ARR):
                </td>
                <td>
                    <input
                        class="slider"
                        type="range"
                        v-model="arrSpeed.value"
                        min="1"
                        max="500"
                        step="1"
                        @change="
                            setConfig('ARR_SPEED', ($event.target as HTMLInputElement).value, false)
                        "
                    />
                    ({{ arrSpeed.value }}MS)
                </td>
            </tr>

            <tr>
                <td title="The url of the background image.">BACKGROUND IMAGE:</td>
                <td>
                    <input
                        type="text"
                        class="text"
                        v-model="backgroundURL.value"
                        @change="
                            {
                                $emit('changebg', ($event.target as HTMLInputElement).value);
                                setConfig(
                                    'BACKGROUND_URL',
                                    ($event.target as HTMLInputElement).value,
                                    false,
                                    true
                                );
                            }
                        "
                    />
                </td>
            </tr>

            <tr>
                <td>&nbsp;</td>
            </tr>

            <tr>
                <td>RESET TO DEFAULT</td>
                <td>
                    <button
                        class="menu-button"
                        @click="
                            {
                                resetConfig();
                                $emit('changebg', CONFIG.BACKGROUND_URL.defaultValue);
                            }
                        "
                    >
                        RESET TO DEFAULT
                    </button>
                </td>
            </tr>
        </table>

        <div class="preview">
            <div class="header">PREVIEW:</div>
            <table>
                <tr v-for="(row, i) in dummyGame.board.GameBoard" :key="i">
                    <td
                        v-for="(block, j) in row"
                        :key="j"
                        :class="getColorClass(dummyGame, block, i, j)"
                    ></td>
                </tr>
            </table>
        </div>
    </div>

    <div class="board-preview"></div>
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
    margin-bottom: 10px;
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

.preview {
    padding-top: 20px;
    padding-bottom: 20px;
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

.text {
    background-color: #333;
    font-family: 'Press Start 2P';
    font-size: 1rem;
    color: #ddd;
    border: none;
}

.text:hover {
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

@media (max-width: 1800px) {
    .preview {
        display: none;
    }
}
</style>
