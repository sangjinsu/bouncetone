// src/maps/hardMaps.ts
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

export function hardMap1(width: number, height: number): MapResult {
    const walls: Body[] = createBorders(width, height);
    const cols = 18, rows = 12;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let y = 2; y < rows - 2; y++) {
        for (let x = 1; x < cols - 1; x++) {
            if ((x + y) % 4 === 0) {
                const wall = Bodies.rectangle(x * cellW + cellW / 2, y * cellH + cellH / 2, cellW * 0.8, 10, { isStatic: true });
                walls.push(assignWallTone(wall));
            }
        }
    }

    const startBlock = Bodies.rectangle(cellW * 1.5, height - cellH, 40, 40, {
        restitution: 0.5,
        label: 'player',
        render: { fillStyle: '#38bdf8' },
    });

    const goalBlock = Bodies.rectangle(width - cellW * 1.5, cellH, 40, 40, {
        isStatic: true,
        label: 'goal',
        render: { fillStyle: 'gold' },
    });

    return { walls, startBlock, goalBlock };
}

export function hardMap2(width: number, height: number): MapResult {
    const walls: Body[] = createBorders(width, height);
    const cols = 18, rows = 12;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let i = 1; i < cols - 1; i += 2) {
        const wall1 = Bodies.rectangle(i * cellW + cellW / 2, cellH * 3, 10, cellH * 2, { isStatic: true });
        const wall2 = Bodies.rectangle(i * cellW + cellW / 2, cellH * 8, 10, cellH * 2, { isStatic: true });
        walls.push(assignWallTone(wall1), assignWallTone(wall2));
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

export function hardMap3(width: number, height: number): MapResult {
    const walls: Body[] = createBorders(width, height);
    const cols = 18, rows = 12;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let x = 2; x < cols - 2; x += 2) {
        for (let y = 1; y < rows - 1; y += 3) {
            const wall = Bodies.rectangle(x * cellW + cellW / 2, y * cellH + cellH / 2, cellW * 0.8, 10, { isStatic: true });
            walls.push(assignWallTone(wall));
        }
    }

    const startBlock = Bodies.rectangle(cellW * 2, height - cellH, 40, 40, {
        restitution: 0.5,
        label: 'player',
        render: { fillStyle: '#38bdf8' },
    });

    const goalBlock = Bodies.rectangle(width - cellW * 2, cellH, 40, 40, {
        isStatic: true,
        label: 'goal',
        render: { fillStyle: 'gold' },
    });

    return { walls, startBlock, goalBlock };
}