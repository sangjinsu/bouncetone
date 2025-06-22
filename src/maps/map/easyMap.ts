// src/maps/easyMaps.ts
import { Body, Bodies } from 'matter-js';
import type { MapResult } from '../mapResult';
import { assignWallTone } from '../wallToneUtil';

export function easyMap(width: number, height: number): MapResult {
    const walls: Body[] = [];
    const cols = 8, rows = 5;
    const cellW = width / cols;
    const cellH = height / rows;

    const borderWalls = [
        Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true }),
        Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true }),
        Bodies.rectangle(10, height / 2, 20, height, { isStatic: true }),
        Bodies.rectangle(width - 10, height / 2, 20, height, { isStatic: true })
    ];
    borderWalls.forEach(w => walls.push(assignWallTone(w)));

    for (let i = 1; i < cols - 1; i++) {
        if (i !== 3) {
            const wall = Bodies.rectangle(i * cellW + cellW / 2, height / 2, 10, cellH, { isStatic: true });
            walls.push(assignWallTone(wall));
        }
    }

    walls.push(assignWallTone(Bodies.rectangle(cellW * 2, cellH * 2, 10, cellH * 2, { isStatic: true })));
    walls.push(assignWallTone(Bodies.rectangle(cellW * 5, cellH * 3, 10, cellH * 2, { isStatic: true })));

    const startBlock = Bodies.rectangle(cellW / 2, height - cellH / 2, 40, 40, {
        restitution: 0.5,
        label: 'player',
        render: { fillStyle: '#38bdf8' },
    });

    const goalBlock = Bodies.rectangle(width - cellW / 2, cellH / 2, 40, 40, {
        isStatic: true,
        label: 'goal',
        render: { fillStyle: 'gold' },
    });

    return { walls, startBlock, goalBlock };
}

export function easyMap2(width: number, height: number): MapResult {
    const walls: Body[] = [];
    const cols = 8, rows = 5;
    const cellW = width / cols;
    const cellH = height / rows;

    const borderWalls = [
        Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true }),
        Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true }),
        Bodies.rectangle(10, height / 2, 20, height, { isStatic: true }),
        Bodies.rectangle(width - 10, height / 2, 20, height, { isStatic: true })
    ];
    borderWalls.forEach(w => walls.push(assignWallTone(w)));

    for (let i = 1; i < cols - 1; i++) {
        const y = i % 2 === 0 ? cellH * 2 : cellH * 3;
        const wall = Bodies.rectangle(i * cellW + cellW / 2, y, 10, cellH, { isStatic: true });
        walls.push(assignWallTone(wall));
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

export function easyMap3(width: number, height: number): MapResult {
    const walls: Body[] = [];
    const cols = 8, rows = 5;
    const cellW = width / cols;
    const cellH = height / rows;

    const borderWalls = [
        Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true }),
        Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true }),
        Bodies.rectangle(10, height / 2, 20, height, { isStatic: true }),
        Bodies.rectangle(width - 10, height / 2, 20, height, { isStatic: true })
    ];
    borderWalls.forEach(w => walls.push(assignWallTone(w)));

    for (let i = 2; i < cols - 2; i++) {
        const wall = Bodies.rectangle(i * cellW + cellW / 2, cellH * 2, 10, cellH * 1.5, { isStatic: true });
        walls.push(assignWallTone(wall));
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