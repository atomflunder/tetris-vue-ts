<script setup lang="ts">
import { getStat } from '@/helpers/stats';
import { msToTime } from '@/helpers/timer';

defineEmits(['back']);
</script>

<template>
    <div class="grid">
        <button class="menu-button back" @click="$emit('back')">BACK TO MENU</button>
        <table class="stats-table">
            <tr>
                <td>PLAY TIME:</td>
                <td>
                    {{ msToTime(getStat('PLAY_TIME')) }}
                </td>
            </tr>

            <tr>
                <td>GAMES PLAYED:</td>
                <td>
                    {{ getStat('GAMES_PLAYED') }}
                </td>
            </tr>

            <tr>
                <td>TOTAL SCORE:</td>
                <td>
                    {{ getStat('TOTAL_SCORE') }}
                </td>
            </tr>

            <tr>
                <td>&nbsp;</td>
            </tr>

            <tr>
                <td>TOTAL LINES:</td>
                <td>
                    {{ getStat('TOTAL LINES') }}
                </td>
            </tr>

            <tr>
                <td>SINGLES:</td>
                <td>
                    {{ getStat('SINGE_LINES') }}
                </td>
            </tr>

            <tr>
                <td>DOUBLES:</td>
                <td>
                    {{ getStat('DOUBLE_LINES') }}
                </td>
            </tr>

            <tr>
                <td>TRIPLES:</td>
                <td>
                    {{ getStat('TRIPLE_LINES') }}
                </td>
            </tr>

            <tr>
                <td>TETRIS:</td>
                <td>
                    {{ getStat('TETRIS_LINES') }}
                </td>
            </tr>

            <tr>
                <td>&nbsp;</td>
            </tr>

            <tr>
                <td>T-SPIN (MINI):</td>
                <td>
                    {{ getStat('T_SPIN_MINI') }}
                </td>
            </tr>

            <tr>
                <td>T-SPIN (FULL):</td>
                <td>
                    {{ getStat('T_SPIN_FULL') }}
                </td>
            </tr>
        </table>
    </div>

    <div class="footer" v-if="getStat('PLAY_TIME') > 0">THANKS FOR PLAYING! :)</div>
</template>

<style scoped>
.grid {
    display: flex;
    justify-content: center;
}

.stats-table {
    padding-top: 20px;
    padding-bottom: 20px;
}

.stats-table td {
    padding-top: 10px;
    padding-bottom: 10px;
}

.stats-table tr:hover {
    background-color: #222;
}

.back {
    position: absolute;
    right: 0%;
    top: 0%;
    margin-right: 10px;
    margin-top: 10px;
}

.footer {
    display: flex;
    justify-content: center;
    font-size: 1.3rem;
}
</style>
