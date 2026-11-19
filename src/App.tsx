
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const animals = [
  "ライオン",
  "ウサギ",
  "うま",
  "しまうま",
  "きりん",
  "ひこにゃん",
  "いんこ",
  "あざらし",
  "しろくま",
  "ペンギン",
  "ねこ",
];

const GAME_LENGTH = 10;

const shuffleAnimals = () => {
  const shuffled = [...animals].sort(() => Math.random() - 0.5);
  return Array.from(
    { length: GAME_LENGTH },
    (_, i) => shuffled[i % shuffled.length]
  );
};

function Bunny() {
  return (
    <svg
      className="bunny"
      viewBox="0 0 160 145"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="白いうさぎ"
    >
      <ellipse cx="57" cy="38" rx="15" ry="34"
        fill="#fff" stroke="#E9DDE4" strokeWidth="2"
        transform="rotate(-14 57 38)" />
      <ellipse cx="101" cy="35" rx="15" ry="35"
        fill="#fff" stroke="#E9DDE4" strokeWidth="2"
        transform="rotate(13 101 35)" />
      <ellipse cx="57" cy="38" rx="7" ry="25"
        fill="#F8C6D9" transform="rotate(-14 57 38)" />
      <ellipse cx="101" cy="35" rx="7" ry="25"
        fill="#F8C6D9" transform="rotate(13 101 35)" />
      <ellipse cx="80" cy="105" rx="45" ry="34" fill="#fff"
        stroke="#E9DDE4" strokeWidth="2" />
      <circle cx="80" cy="65" r="37" fill="#fff"
        stroke="#E9DDE4" strokeWidth="2" />
      <circle cx="66" cy="64" r="3.5" fill="#67515D" />
      <circle cx="94" cy="64" r="3.5" fill="#67515D" />
      <ellipse cx="80" cy="75" rx="5" ry="4" fill="#F49BB9" />
      <path d="M80 79 Q74 87 69 81 M80 79 Q86 87 91 81"
        fill="none" stroke="#A77D8D" strokeWidth="2"
        strokeLinecap="round" />
      <ellipse cx="55" cy="76" rx="8" ry="5" fill="#FFD4E3" />
      <ellipse cx="105" cy="76" rx="8" ry="5" fill="#FFD4E3" />
      <ellipse cx="43" cy="126" rx="18" ry="9" fill="#fff" />
      <ellipse cx="117" cy="126" rx="18" ry="9" fill="#fff" />
      <path d="M35 105 Q80 92 125 105"
        fill="none" stroke="#F1DDE6" strokeWidth="2" />
    </svg>
  );
}

export default function App() {
  const [questions, setQuestions] = useState(shuffleAnimals);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(10);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [feedback, setFeedback] = useState("");

  const currentAnimal = questions[questionIndex];

  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= GAME_LENGTH) {
      setPlaying(false);
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setAnswer("");
    setTime(10);
    setAnswered(false);
    setFeedback("");
  }, [questionIndex]);

  const checkAnswer = useCallback(() => {
    if (answered || !playing) return;

    setAnswered(true);

    if (answer.trim() === currentAnimal) {
      setScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
      setFeedback("せいかい！すごいね！♡");
    } else {
      setFeedback("おしい！次の問題へ！");
    }

    setTimeout(nextQuestion, 800);
  }, [answered, playing, answer, currentAnimal, nextQuestion]);

  useEffect(() => {
    if (!playing || answered) return;

    const timer = setInterval(() => {
      setTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [playing, answered, questionIndex]);

  useEffect(() => {
    if (time === 0 && playing && !answered) {
      setAnswered(true);
      setFeedback("時間切れ！次の問題へ！");
      setTimeout(nextQuestion, 800);
    }
  }, [time, playing, answered, nextQuestion]);

  const restartGame = () => {
    setQuestions(shuffleAnimals());
    setQuestionIndex(0);
    setAnswer("");
    setTime(10);
    setScore(0);
    setCorrectCount(0);
    setAnswered(false);
    setFeedback("");
    setPlaying(true);
  };

  const progress = ((questionIndex + (playing ? 0 : 1)) / GAME_LENGTH) * 100;

  return (
    <main className="app">
      <div className="game-container">

        <header className="header">
          <div className="header-icon">♡</div>
          <p>ANIMAL FLICK GAME</p>
          <h1>どうぶつフリック！</h1>
          <p className="subtitle">
            かわいい動物たちの名前を入力しよう♪
          </p>
        </header>

        <div className="bunny-area">
          <div className="sparkle sparkle-one">✧</div>
          <Bunny />
          <div className="sparkle sparkle-two">♡</div>
        </div>

        <section className="status-area">
          <div className="status-card">
            <span className="status-label">TIME</span>
            <strong className={time <= 3 ? "danger" : ""}>
              {playing ? time : 0}
            </strong>
            <span className="status-unit">SEC</span>
          </div>

          <div className="status-card score-card">
            <span className="status-label">SCORE</span>
            <strong>{score}</strong>
            <span className="status-unit">POINT</span>
          </div>

          <div className="status-card">
            <span className="status-label">QUESTION</span>
            <strong>
              {playing
                ? String(questionIndex + 1).padStart(2, "0")
                : "10"}
            </strong>
            <span className="status-unit">/ 10</span>
          </div>
        </section>

        <div className="progress-area">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {playing ? (
          <section className="question-card">
            <p className="question-label">
              この動物の名前を入力してね！
            </p>

            <div className="animal-name">
              {currentAnimal}
            </div>

            <p className="input-hint">
              ひらがな・カタカナどちらでもOK
            </p>

            <input
              className="answer-input"
              type="text"
              value={answer}
              onChange={(e) => {
                const value = e.target.value;
                setAnswer(value);

                if (
                  value.normalize("NFKC").trim() ===
                  currentAnimal.normalize("NFKC")
                ) {
                  setAnswered(true);
                  setScore((prev) => prev + 100);
                  setCorrectCount((prev) => prev + 1);
                  setFeedback("せいかい！すごいね！♡");
                  setTimeout(nextQuestion, 800);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") checkAnswer();
              }}
              placeholder="ここに入力してね ♡"
              disabled={answered}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              inputMode="text"
            />

            <div className="feedback" aria-live="polite">
              {feedback || " "}
            </div>

            <button
              className="answer-button"
              onClick={checkAnswer}
              disabled={answered || !answer.trim()}
            >
              こたえを決定 ♡
            </button>
          </section>
        ) : (
          <section className="result-card">
            <div className="result-bunny">
              <Bunny />
            </div>
            <h2>ゲーム終了！</h2>
            <p>最後までよくがんばったね ♡</p>

            <div className="result-score">
              <span>あなたのスコア</span>
              <strong>{score}</strong>
              <small>POINT</small>
            </div>

            <p className="result-count">
              10問中 {correctCount} 問正解！
            </p>

            <button
              className="answer-button restart-button"
              onClick={restartGame}
            >
              もう一度あそぶ ♡
            </button>
          </section>
        )}

        <footer>
          <p>♡ うさぎといっしょにがんばろう ♡</p>
          <small>ANIMAL FLICK GAME</small>
        </footer>
      </div>
    </main>
  );
}
