import { Timer } from '@/helpers/timer';
import { expect, test } from 'vitest';

test('New Timer', () => {
    const timer = new Timer();

    expect(timer.currentTime).toEqual(0);

    expect(timer.toReadableTime()).toEqual('00:00.000');

    timer.update();

    expect(timer.currentTime).toBeGreaterThan(0);
});
