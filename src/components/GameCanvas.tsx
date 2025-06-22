// src/components/GameCanvas.tsx
import React, { useEffect, useRef } from 'react';
import {
    Engine,
    Render,
    Runner,
    World,
    Events,
    Body,
    type IEventCollision,
} from 'matter-js';
import { generateMap } from '../hooks/useMapGenerator';
import { playToneOnCollision } from '../engine/sound';
import { getToneByWallId } from '../maps/wallToneUtil';

const toneColorMap: Record<string, string> = {
    'C': '#f87171',
    'D': '#fbbf24',
    'E': '#34d399',
    'F': '#60a5fa',
    'G': '#a78bfa',
    'A': '#f472b6',
    'B': '#38bdf8',
};

const backgroundMap: Record<'easy' | 'normal' | 'hard', string> = {
    easy: 'rgba(15,23,42,0.5)',     // slate-900 with medium opacity
    normal: 'rgba(15,23,42,0.7)',   // slate-900 with stronger opacity
    hard: 'rgba(15,23,42,1)',       // solid dark
};

const wallColorMap: Record<'easy' | 'normal' | 'hard', string> = {
    easy: '#334155',   // slate-700
    normal: '#1e293b', // slate-800
    hard: '#0f172a',   // slate-900
};

interface GameCanvasProps {
    mode: 'easy' | 'normal' | 'hard';
    onClear?: () => void;
}

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
};

type Pulse = {
    body: Body;
    time: number;
    toneColor: string;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ mode, onClear }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const particles = useRef<Particle[]>([]);
    const pulses = useRef<Pulse[]>([]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const engine = Engine.create();
        engine.gravity.y = 1.2;

        const render = Render.create({
            element,
            engine,
            options: {
                width,
                height,
                wireframes: false,
                background: backgroundMap[mode],
            },
        });

        const { walls, startBlock, goalBlock } = generateMap(mode, Math.random().toString(), { width, height });

        // 기본 벽 색을 난이도에 따라 적용
        walls.forEach(w => w.render.fillStyle = wallColorMap[mode]);
        World.add(engine.world, [...walls, startBlock, goalBlock]);

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        const movement = {
            left: false,
            right: false,
        };

        let jumpCount = 0;
        const maxJumps = 2;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') movement.left = true;
            else if (e.code === 'ArrowRight') movement.right = true;
            else if (e.code === 'Space') {
                if (jumpCount < maxJumps) {
                    Body.setVelocity(startBlock, { x: startBlock.velocity.x, y: 0 });
                    Body.applyForce(startBlock, startBlock.position, { x: 0, y: -0.08 });
                    jumpCount++;
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') movement.left = false;
            else if (e.code === 'ArrowRight') movement.right = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        Events.on(engine, 'beforeUpdate', () => {
            const forceX = 0.0025;
            if (movement.left) {
                Body.applyForce(startBlock, startBlock.position, { x: -forceX, y: 0 });
            } else if (movement.right) {
                Body.applyForce(startBlock, startBlock.position, { x: forceX, y: 0 });
            }

            render.bounds.min.x = startBlock.position.x - width / 2;
            render.bounds.max.x = startBlock.position.x + width / 2;
            render.bounds.min.y = startBlock.position.y - height / 2;
            render.bounds.max.y = startBlock.position.y + height / 2;

            const context = render.context;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.translate(-render.bounds.min.x, -render.bounds.min.y);

            if (startBlock.position.y > height * 2) {
                console.log('💥 바닥에 떨어졌습니다!');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        });

        Events.on(render, 'afterRender', () => {
            const ctx = render.context;
            // 🎇 파티클 그리기
            particles.current = particles.current.filter(p => p.life > 0);
            for (const p of particles.current) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 60;
                ctx.fill();
                ctx.globalAlpha = 1;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.life--;
            }

            // 🌈 컬러 펄스 처리 (toneColor 기준)
            const fadeTime = 500;
            pulses.current = pulses.current.filter(p => Date.now() - p.time < fadeTime);
            for (const p of pulses.current) {
                const elapsed = Date.now() - p.time;
                const ratio = elapsed / fadeTime;
                const base = p.toneColor;
                p.body.render.fillStyle = ratio < 0.5 ? base : wallColorMap[mode];
            }
        });

        Events.on(engine, 'collisionStart', (event: IEventCollision<Engine>) => {
            for (const pair of event.pairs) {
                const impactStrength = Math.hypot(
                    pair.bodyA.velocity.x - pair.bodyB.velocity.x,
                    pair.bodyA.velocity.y - pair.bodyB.velocity.y
                );

                const wallBody = pair.bodyA.isStatic ? pair.bodyA : pair.bodyB;
                playToneOnCollision(wallBody, impactStrength);

                if (wallBody.isStatic) {
                    // 🎇 파티클 생성
                    for (let i = 0; i < 15; i++) {
                        const angle = Math.random() * 2 * Math.PI;
                        const speed = Math.random() * 2;
                        particles.current.push({
                            x: pair.collision.supports[0].x,
                            y: pair.collision.supports[0].y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            life: 60,
                            color: 'white',
                        });
                    }
                    // 🌈 펄스 효과 등록
                    const tone = getToneByWallId(wallBody.id);
                    const color = toneColorMap[tone] || '#f87171';
                    pulses.current.push({ body: wallBody, time: Date.now(), toneColor: color });
                }

                if (
                    (pair.bodyA === startBlock && pair.bodyB === goalBlock) ||
                    (pair.bodyB === startBlock && pair.bodyA === goalBlock)
                ) {
                    onClear?.();
                }

                if (pair.bodyA === startBlock || pair.bodyB === startBlock) {
                    if ((pair.bodyA.isStatic || pair.bodyB.isStatic)) {
                        jumpCount = 0;
                    }
                }
            }
        });

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
            render.canvas.remove();
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [mode, onClear]);

    return (
        <div
            ref={containerRef}
            className="absolute top-0 left-0 w-screen h-screen z-10"
        />
    );
};

export default GameCanvas;