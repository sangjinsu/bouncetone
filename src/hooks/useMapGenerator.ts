import seedrandom from 'seedrandom';
import {easyMap, easyMap2, easyMap3} from "../maps/map/easyMap.ts";
import {normalMap1, normalMap2, normalMap3} from "../maps/map/normalMap.ts";
import {hardMap1, hardMap2, hardMap3} from "../maps/map/hardMap.ts";
import type {MapResult} from "../maps/mapResult.ts";

export function generateMap(
    mode: 'easy' | 'normal' | 'hard',
    seed: string,
    canvasSize: { width: number; height: number }
): MapResult {
    const rng = seedrandom(seed);
    const index = Math.floor(rng() * 3);

    const easyMaps = [easyMap, easyMap2, easyMap3];
    const normalMaps = [normalMap1, normalMap2, normalMap3];
    const hardMaps = [hardMap1, hardMap2, hardMap3];

    switch (mode) {
        case 'easy':
            return easyMaps[index](canvasSize.width, canvasSize.height);
        case 'normal':
            return normalMaps[index](canvasSize.width, canvasSize.height);
        case 'hard':
            return hardMaps[index](canvasSize.width, canvasSize.height);
        default:
            throw new Error('Invalid mode');
    }
}




