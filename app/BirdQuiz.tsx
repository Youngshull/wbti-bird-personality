"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BIRDS, BirdResult, QUESTIONS, scoreQuiz } from "./lib/quiz";

type Screen = "intro" | "quiz" | "loading" | "result";

const ANSWER_OPTIONS = [
  { value: -2, label: "非常像我", side: "left" },
  { value: -1, label: "比较像我", side: "left" },
  { value: 1, label: "比较像我", side: "right" },
  { value: 2, label: "非常像我", side: "right" },
] as const;

const HERO_BIRDS = [
  BIRDS["--+-"],
  BIRDS["++--"],
  BIRDS["-++-"],
  BIRDS["+---"],
  BIRDS["----"],
  BIRDS["-+--"],
];

export default function BirdQuiz() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(0));
  const [result, setResult] = useState<BirdResult | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("wbti-progress");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { answers: number[]; current: number };
      if (Array.isArray(parsed.answers) && parsed.answers.some(Boolean)) {
        setAnswers(parsed.answers.slice(0, QUESTIONS.length));
        setCurrent(Math.min(parsed.current, QUESTIONS.length - 1));
        setHasSavedProgress(true);
      }
    } catch {
      window.localStorage.removeItem("wbti-progress");
    }
  }, []);

  useEffect(() => {
    if (screen !== "quiz") return;
    window.localStorage.setItem("wbti-progress", JSON.stringify({ answers, current }));
  }, [answers, current, screen]);

  const question = QUESTIONS[current];
  const progress = ((current + 1) / QUESTIONS.length) * 100;
  const answeredCount = useMemo(() => answers.filter(Boolean).length, [answers]);

  const startFresh = () => {
    setAnswers(Array(QUESTIONS.length).fill(0));
    setCurrent(0);
    setResult(null);
    setError("");
    setHasSavedProgress(false);
    window.localStorage.removeItem("wbti-progress");
    setScreen("quiz");
  };

  const submitAnswers = useCallback(async (nextAnswers: number[]) => {
    setScreen("loading");
    setError("");
    try {
      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      if (!response.ok) throw new Error("request failed");
      const data = (await response.json()) as { result: BirdResult };
      setResult(data.result);
    } catch {
      setResult(scoreQuiz(nextAnswers).result);
    }
    window.localStorage.removeItem("wbti-progress");
    window.setTimeout(() => setScreen("result"), 720);
  }, []);

  const chooseAnswer = useCallback((value: number) => {
    const nextAnswers = [...answers];
    nextAnswers[current] = value;
    setAnswers(nextAnswers);

    if (current === QUESTIONS.length - 1) {
      void submitAnswers(nextAnswers);
      return;
    }
    window.setTimeout(() => setCurrent((index) => index + 1), 180);
  }, [answers, current, submitAnswers]);

  useEffect(() => {
    if (screen !== "quiz") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const option = ANSWER_OPTIONS[Number(event.key) - 1];
      if (option) chooseAnswer(option.value);
      if (event.key === "ArrowLeft" && current > 0) setCurrent((index) => index - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chooseAnswer, current, screen]);

  const copyResult = async () => {
    if (!result) return;
    const text = `我的 WBTI 鸟格是「${result.name} ${result.english}」——${result.body}`;
    await navigator.clipboard?.writeText(text);
  };

  return (
    <main className={`site-shell screen-${screen}`}>
      {screen === "intro" && (
        <section className="intro-screen" aria-labelledby="intro-title">
          <div className="paper-grain" />
          <header className="brand-row">
            <div className="mini-brand"><span>WBTI</span><small>WHICH BIRD TYPE INDICATOR</small></div>
            <div className="wild-stamp">KEEP IT WILD <b>↗</b></div>
          </header>

          <div className="intro-copy">
            <p className="eyebrow">WHICH BIRD ARE YOU TODAY?</p>
            <h1 id="intro-title"><span>今天，</span>测测你的<br /><em>鸟格</em>特质</h1>
            <p className="intro-note">沿着 32 个生活片段，找到藏在你性格里的那只鸟。</p>

            <div className="intro-actions">
              <button className="primary-button" onClick={startFresh}>出发 · 开始测试 <span>➜</span></button>
              {hasSavedProgress && (
                <button className="resume-button" onClick={() => setScreen("quiz")}>继续上次的第 {current + 1} 题</button>
              )}
            </div>

            <div className="quiz-facts" aria-label="测试信息">
              <span><b>32</b> 道题</span><i />
              <span><b>5–7</b> 分钟</span><i />
              <span><b>16</b> 种鸟格</span>
            </div>
          </div>

          <div className="hero-collage" aria-hidden="true">
            <div className="sun-doodle">✦</div>
            {HERO_BIRDS.map((bird, index) => (
              <div className={`hero-bird hero-bird-${index + 1}`} key={bird.id}>
                <img src={bird.image} alt="" />
              </div>
            ))}
            <div className="lake-scribble">˜ ˜ ˜ ˜ ˜</div>
            <div className="porpoise-bubble">江豚湾的<br />鸟朋友</div>
          </div>

          <footer className="intro-footer">
            <span>⌖ 湖口 · 鄱阳湖</span>
            <span>记录自然 · 遇见自己 ♥</span>
          </footer>
        </section>
      )}

      {screen === "quiz" && (
        <section className="quiz-screen" aria-labelledby="question-title">
          <div className="paper-grain" />
          <header className="quiz-header">
            <button className="text-button" onClick={() => setScreen("intro")} aria-label="返回封面">← 返回</button>
            <div className="quiz-logo">WBTI <span>鸟格测试</span></div>
            <span className="question-count">{String(current + 1).padStart(2, "0")} / {QUESTIONS.length}</span>
          </header>

          <div className="progress-track" aria-label={`答题进度 ${Math.round(progress)}%`}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="question-wrap" key={question.id}>
            <p className="question-kicker">想象一下这个画面</p>
            <h2 id="question-title">{question.scene}</h2>
            <p className="question-help">哪一种反应更接近真实的你？</p>

            <div className="answer-stage">
              <div className="statement-card statement-left">
                <span>A</span>
                <p>{question.left}</p>
                <div className="statement-buttons">
                  {ANSWER_OPTIONS.slice(0, 2).map((option, optionIndex) => (
                    <button
                      key={option.value}
                      className={answers[current] === option.value ? "selected" : ""}
                      onClick={() => chooseAnswer(option.value)}
                    >
                      <kbd>{optionIndex + 1}</kbd>{option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="or-mark"><span>OR</span></div>

              <div className="statement-card statement-right">
                <span>B</span>
                <p>{question.right}</p>
                <div className="statement-buttons">
                  {ANSWER_OPTIONS.slice(2).map((option, optionIndex) => (
                    <button
                      key={option.value}
                      className={answers[current] === option.value ? "selected" : ""}
                      onClick={() => chooseAnswer(option.value)}
                    >
                      <kbd>{optionIndex + 3}</kbd>{option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="quiz-footer">
            <button className="text-button" disabled={current === 0} onClick={() => setCurrent((index) => index - 1)}>← 上一题</button>
            <span>已回答 {answeredCount} 题</span>
            <button className="text-button" disabled={!answers[current] || current === QUESTIONS.length - 1} onClick={() => setCurrent((index) => index + 1)}>下一题 →</button>
          </footer>
        </section>
      )}

      {screen === "loading" && (
        <section className="loading-screen" aria-live="polite">
          <div className="paper-grain" />
          <div className="loading-bird">●</div>
          <p>正在辨认你的鸟格足迹…</p>
          <div className="loading-line"><span /></div>
        </section>
      )}

      {screen === "result" && result && (
        <section className="result-screen" style={{ "--result-accent": result.accent } as React.CSSProperties} aria-labelledby="result-title">
          <div className="paper-grain" />
          <header className="result-header"><span>WBTI · 你的鸟格报告</span><span>江豚湾的鸟朋友</span></header>
          <div className="result-card">
            <p className="result-kicker">YOU ARE A</p>
            <div className="result-image-wrap">
              <div className="result-tape" />
              <img src={result.image} alt={`${result.name}的代表鸟插画`} />
            </div>
            <div className="result-copy">
              <h1 id="result-title">{result.name}</h1>
              <h2>{result.english}</h2>
              <div className="result-rule" />
              <p>{result.body}</p>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="result-actions">
            <button className="primary-button" onClick={copyResult}>复制我的结果</button>
            <button className="resume-button" onClick={startFresh}>再测一次</button>
          </div>
          <p className="result-disclaimer">测试结果仅供自我探索，请勿用于严肃人生决策哦！</p>
        </section>
      )}
    </main>
  );
}
