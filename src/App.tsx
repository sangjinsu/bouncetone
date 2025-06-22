import { useState } from 'react';
import GameCanvas from './components/GameCanvas';

const App = () => {
    const [mode, setMode] = useState<'easy' | 'normal' | 'hard' | null>(null);
    const [isCleared, setIsCleared] = useState(false);
    const [time, setTime] = useState(0);
    const [score, setScore] = useState(0);
    const [grade, setGrade] = useState('');
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    const calculateScore = (elapsed: number) => {
        const base = 1000;
        const penalty = Math.floor(elapsed * 10);
        const rawScore = Math.max(base - penalty, 0);
        const finalScore = Math.round(rawScore);

        let grade = 'D';
        if (finalScore >= 900) grade = 'S';
        else if (finalScore >= 750) grade = 'A';
        else if (finalScore >= 500) grade = 'B';
        else if (finalScore >= 300) grade = 'C';

        return { finalScore, grade };
    };

    const handleClear = () => {
        if (startTime === null) return;
        const elapsed = (Date.now() - startTime) / 1000;
        setTime(elapsed);
        const { finalScore, grade } = calculateScore(elapsed);
        setScore(finalScore);
        setGrade(grade);
        setIsCleared(true);

        const stored = localStorage.getItem(`bestScore_${mode}`);
        const prevBest = stored ? parseInt(stored) : null;
        if (!prevBest || finalScore > prevBest) {
            setBestScore(finalScore);
            setIsNewRecord(true);
            localStorage.setItem(`bestScore_${mode}`, finalScore.toString());
        } else {
            setBestScore(prevBest);
            setIsNewRecord(false);
        }
    };

    const handleReset = () => {
        setMode(null);
        setIsCleared(false);
        setTime(0);
        setScore(0);
        setGrade('');
        setIsNewRecord(false);
        setStartTime(null);
    };

    const handleStart = () => {
        setStartTime(Date.now());
    };

    return (
        <div className="w-screen h-screen bg-gray-900 text-white relative">
            {mode === null ? (
                <div className="flex flex-col justify-center items-center h-full space-y-4">
                    <h1 className="text-3xl font-bold">🎵 BounceTone</h1>
                    <p>난이도를 선택하세요</p>
                    <div className="flex space-x-4">
                        <button onClick={() => { setMode('easy'); handleStart(); }} className="px-4 py-2 bg-green-500 rounded">Easy</button>
                        <button onClick={() => { setMode('normal'); handleStart(); }} className="px-4 py-2 bg-yellow-500 rounded">Normal</button>
                        <button onClick={() => { setMode('hard'); handleStart(); }} className="px-4 py-2 bg-red-500 rounded">Hard</button>
                    </div>
                </div>
            ) : (
                <>
                    <GameCanvas mode={mode} onClear={handleClear} />
                    <div className="absolute top-4 left-4 text-lg bg-black/50 px-3 py-1 rounded">
                        ⏱ {time.toFixed(1)}초
                    </div>
                    {isCleared && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center space-y-6 z-50">
                            <h2 className="text-4xl font-bold text-yellow-300">🎉 클리어!</h2>
                            <p className="text-lg">⏱ 기록: {time.toFixed(1)}초</p>
                            <p className="text-xl">🏆 점수: {score}점</p>
                            <p className="text-xl">📊 등급: {grade}</p>
                            {isNewRecord && <p className="text-green-400">🔥 최고 기록 갱신!</p>}
                            {bestScore !== null && !isNewRecord && (
                                <p className="text-sm text-gray-300">📈 최고 기록: {bestScore}점</p>
                            )}
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 bg-white text-black rounded font-semibold mt-4"
                            >
                                초기 화면으로 이동하기
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default App;