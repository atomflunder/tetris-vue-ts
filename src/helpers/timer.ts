export class Timer {
    initialTime: number;
    currentTime: number;

    constructor() {
        this.initialTime = Date.now();
        this.currentTime = 0;
    }

    update(): void {
        this.currentTime = Date.now() - this.initialTime;
    }

    toReadableTime(): string {
        return msToTime(this.currentTime);
    }
}

/**
 * Converts a timer from milliseconds to a human readable time.
 * Formatted in MM:SS.SSS
 */
export const msToTime = (s: number): string => {
    function pad(n: number, z: number = 2) {
        return ('00' + n).slice(-z);
    }

    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;

    return pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
};
