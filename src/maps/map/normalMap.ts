// src/maps/normalMaps.ts
import { Body, Bodies } from 'matter-js';
import type { MapResult } from '../mapResult';
import { assignWallTone } from '../wallToneUtil';

function createBorders(width: number, height: number): Body[] {
    return [
        Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true }),
        Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true }),
        Bodies.rectangle(10, height / 2, 20, height, { isStatic: true }),
        Bodies.rectangle(width - 10, height / 2, 20, height, { isStatic: true })
    ].map(assignWallTone);
}

export function normalMap1(width: number, height: number): MapResult {
    const walls: Body[] = createBorders(width, height);
    const cols = 12, rows = 8;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let y = 2; y < rows - 2; y++) {
        if (y % 2 === 0) {
            for (let x = 1; x < cols - 1; x++) {
                if ((x + y) % 3 !== 0) {
                    const wall = Bodies.rectangle(x * cellW + cellW / 2, y * cellH + cellH / 2, 10, cellH, { isStatic: true });
                    walls.push(assignWallTone(wall));
                }
            }
        }
    }

    const startBlock = Bodies.rectangle(cellW, height - cellH, 40, 40, {
        restitution: 0.5,
        label: 'player',
        render: { fillStyle: '#38bdf8' },
    });

    const goalBlock = Bodies.rectangle(width - cellW, cellH, 40, 40, {
        isStatic: true,
        label: 'goal',
        render: { fillStyle: 'gold' },
    });

    return { walls, startBlock, goalBlock };
}

export function normalMap2(width: number, height: number): MapResult {
    const walls: Body[] = createBorders(width, height);
    const cols = 12, rows = 8;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let x = 2; x < cols - 2; x++) {
        const y = x % 2 === 0 ? 3 : 4;
        const wall = Bodies.rectangle(x * cellW + cellW / 2, y * cellH + cellH / 2, 10, cellH, { isStatic: true });
        walls.push(assignWallTone(wall));
    }

    for (let y = 1; y < rows - 1; y++) {
        if (y % 2 !== 0) {
            const wall = Bodies.rectangle(cellW * 6, y * cellH + cellH / 2, cellW * 0.5, 10, { isStatic: true });
            walls.push(assignWallTone(wall));
        }
    }

    const startBlock = Bodies.rectangle(cellW, height - cellH, 40, 40, {
        restitution: 0.5,
        label: 'player',
        render: { fillStyle: '#38bdf8' },
    });

    const goalBlock = Bodies.rectangle(width - cellW, cellH, 40, 40, {
        isStatic: true,
        label: 'goal',
        render: { fillStyle: 'gold' },
    });

    return { walls, startBlock, goalBlock };
}

export function normalMap3(width: number, height: number): MapResult {
    const walls: Body[] = createBorders(width, height);
    const cols = 12, rows = 8;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let i = 1; i < cols - 1; i += 2) {
        const wall1 = Bodies.rectangle(i * cellW + cellW / 2, cellH * 2, 10, cellH * 2, { isStatic: true });
        walls.push(assignWallTone(wall1));

        if (i < cols - 3) {
            const wall2 = Bodies.rectangle((i + 1) * cellW + cellW / 2, cellH * 5, 10, cellH * 2, { isStatic: true });
            walls.push(assignWallTone(wall2));
        }
    }

    const startBlock = Bodies.rectangle(cellW, height - cellH, 40, 40, {
        restitution: 0.5,
        label: 'player',
        render: { fillStyle: '#38bdf8' },
    });

    const goalBlock = Bodies.rectangle(width - cellW, cellH, 40, 40, {
        isStatic: true,
        label: 'goal',
        render: { fillStyle: 'gold' },
    });

    return { walls, startBlock, goalBlock };
}