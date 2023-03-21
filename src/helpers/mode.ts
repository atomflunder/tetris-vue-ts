import { Menu } from './types';

export const getMaxLines = (gameMode: Menu): number | null => {
    switch (gameMode) {
        case Menu.Marathon:
            return 150;
        case Menu.Sprint:
            return 4;
        default:
            return null;
    }
};

export const getMaxTime = (gameMode: Menu): number | null => {
    switch (gameMode) {
        case Menu.Time:
            return 180000;
        default:
            return null;
    }
};
