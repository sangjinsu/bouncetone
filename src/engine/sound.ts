// src/engine/sound.ts
import { Howl } from 'howler';
import { Body } from 'matter-js';

const toneMap = new Map<string, Howl>();
const tones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// 미리 tone 객체 생성 (각각의 음 파일은 public/tone_C.mp3 와 같은 경로에 위치해야 함)
tones.forEach((note) => {
    toneMap.set(note, new Howl({ src: [`/tones/${note}4.mp3`] }));
});

function getToneFromPosition(body: Body): string {
    // 충돌 위치를 기반으로 고정된 음정 반환
    const x = Math.floor(body.position.x / 100) % tones.length;
    return tones[x];
}

export function playGoalSound() {
    const audio = new Audio('/sounds/goal.mp3'); // 경로에 맞게 사운드 배치
    audio.volume = 0.9;
    audio.play();
}

export function playToneOnCollision(body: Body, volume: number) {
    const tone = getToneFromPosition(body);
    const sound = toneMap.get(tone);
    if (sound) {
        sound.volume(Math.min(volume / 10, 1.0));
        sound.play();
    }
}