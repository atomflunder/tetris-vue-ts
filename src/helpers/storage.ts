import { msToTimer } from './style';
import { Menu } from './types';

export const getHighScore = (gameMode: Menu): string => {
    const score = localStorage.getItem(`highscore-${gameMode}`) || '0';
    const bestTime = localStorage.getItem(`besttime-${gameMode}`) || '0';

    return `${score} / ${msToTimer(Number(bestTime))}`;
};

export const setHighScore = (
    gameMode: Menu,
    currentScore: number,
    currentTime: number,
    gameOver: boolean
): void => {
    // Those modes have high scores based on time, not score.
    if (gameMode === Menu.Marathon || gameMode === Menu.Sprint) {
        if (gameOver) {
            // We only want records that actually finish.
            return;
        }

        let time = Number(localStorage.getItem(`besttime-${gameMode}`) || '0');

        // A time of 0 means no time set, so everything is better than that.
        if (time === 0) {
            time = Infinity;
        }

        if (currentTime < time) {
            localStorage.setItem(`highscore-${gameMode}`, currentScore.toString());
            localStorage.setItem(`besttime-${gameMode}`, currentTime.toString());
        }

        return;
    }

    // On the other modes, we can count every record, and sort by score.
    // The time will get saved too, though.
    const score = localStorage.getItem(`highscore-${gameMode}`) || '0';

    if (currentScore > Number(score)) {
        localStorage.setItem(`highscore-${gameMode}`, currentScore.toString());
        localStorage.setItem(`besttime-${gameMode}`, currentTime.toString());
    }
};
