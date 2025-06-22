import { Body } from 'matter-js';

export const wallToneMap = new Map<number, string>();
const toneList = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export function assignWallTone(wall: Body): Body {
    const tone = toneList[Math.floor(Math.random() * toneList.length)];
    wallToneMap.set(wall.id, tone);
    return wall;
}

export function getToneByWallId(id: number): string {
    return wallToneMap.get(id) || 'C';
}
