"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BirdScreen from "./components/BirdScreen";
import GalleryScreen from "./components/GalleryScreen";
import IntroScreen from "./components/IntroScreen";
import PosterSheet from "./components/PosterSheet";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import RevealScreen from "./components/RevealScreen";
import { birdImage, BIRDS_BY_ID, QUESTIONS, scoreQuiz, type QuizOutcome } from "./lib/quiz";
import { clearProgress, readLastAnswers, readProgress, saveLastAnswers, saveProgress } from "./lib/storage";

type View =
  | { name: "intro" }
  | { name: "quiz" }
  | { name: "reveal" }
  | { name: "result" }
  | { name: "gallery" }
  | { name: "bird"; id: string; shared?: boolean };

type HistoryState = { wbti?: View; wbtiDepth?: number } & Record<string, unknown>;

const ADVANCE_DELAY = 220;
const DEFAULT_TITLE = "WBTI 鸟格测试｜今天的你是哪一只鸟？";

const emptyAnswers = () => Array<number>(QUESTIONS.length).fill(0);
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function preloadBird(id: string) {
  const image = new Image();
  image.sizes = "(min-width: 900px) 440px, 84vw";
  image.srcset = `${birdImage(id, 480)} 480w, ${birdImage(id, 960)} 960w`;
}

export default function BirdQuiz() {
  const [view, setView] = useState<View>({ name: "intro" });
  const [answers, setAnswers] = useState<number[]>(emptyAnswers);
  const [current, setCurrent] = useState(0);
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timers = useRef<number[]>([]);
  const hasNavigated = useRef(false);

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  // 页面内的每一步都写进浏览器历史，手机返回手势不会直接退出网站。
  const go = useCallback((next: View, mode: "push" | "replace" = "push") => {
    const state = (window.history.state ?? {}) as HistoryState;
    const depth = (state.wbtiDepth ?? 0) + (mode === "push" ? 1 : 0);
    const url = next.name === "bird" && next.shared ? window.location.href : window.location.pathname;
    const entry: HistoryState = { ...state, wbti: next, wbtiDepth: depth };
    if (mode === "push") window.history.pushState(entry, "", url);
    else window.history.replaceState(entry, "", url);
    hasNavigated.current = true;
    setView(next);
  }, []);

  const leave = useCallback((fallback: View) => {
    const state = (window.history.state ?? {}) as HistoryState;
    if ((state.wbtiDepth ?? 0) > 0) window.history.back();
    else go(fallback, "replace");
  }, [go]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const progress = readProgress();
      if (progress) {
        setAnswers(progress.answers);
        setCurrent(progress.current);
      }
      const lastAnswers = readLastAnswers();
      if (lastAnswers) setOutcome(scoreQuiz(lastAnswers));

      const sharedId = new URLSearchParams(window.location.search).get("bird");
      const state = (window.history.state ?? {}) as HistoryState;
      if (sharedId && BIRDS_BY_ID[sharedId]) {
        const next: View = { name: "bird", id: sharedId, shared: true };
        window.history.replaceState({ ...state, wbti: next, wbtiDepth: 0 }, "");
        setView(next);
      } else {
        window.history.replaceState({ ...state, wbti: { name: "intro" }, wbtiDepth: 0 }, "");
      }
    });

    const onPopState = (event: PopStateEvent) => {
      const next = (event.state as HistoryState | null)?.wbti;
      hasNavigated.current = true;
      setPosterOpen(false);
      setIsAdvancing(false);
      setView(next && next.name !== "reveal" ? next : { name: "intro" });
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // 切换页面时清掉未完成的自动翻题，并把焦点和滚动位置带到新页面顶部。
  useEffect(() => {
    if (view.name !== "quiz" && view.name !== "reveal") {
      clearTimers();
    }
    if (!hasNavigated.current) return;
    window.scrollTo({ top: 0 });
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [view, clearTimers]);

  useEffect(() => {
    if (view.name !== "quiz" || !answers.some(Boolean)) return;
    saveProgress({ answers, current });
  }, [answers, current, view.name]);

  useEffect(() => {
    const bird = view.name === "bird" ? BIRDS_BY_ID[view.id] : view.name === "result" ? outcome?.bird : null;
    document.title = bird ? `${bird.name}（${bird.species}）｜WBTI 鸟格测试` : DEFAULT_TITLE;
  }, [view, outcome]);

  const resumeAt = answers.some(Boolean) ? current : null;

  const start = useCallback(() => {
    clearTimers();
    clearProgress();
    setAnswers(emptyAnswers());
    setCurrent(0);
    setIsAdvancing(false);
    go({ name: "quiz" });
  }, [clearTimers, go]);

  const resume = useCallback(() => go({ name: "quiz" }), [go]);

  const finish = useCallback((finalAnswers: number[]) => {
    const firstGap = finalAnswers.indexOf(0);
    if (firstGap !== -1) {
      setCurrent(firstGap);
      return;
    }

    const result = scoreQuiz(finalAnswers);
    preloadBird(result.bird.id);
    setOutcome(result);
    saveLastAnswers(finalAnswers);
    clearProgress();
    setAnswers(emptyAnswers());
    setCurrent(0);
    go({ name: "reveal" }, "replace");
    later(() => go({ name: "result" }, "replace"), prefersReducedMotion() ? 450 : 1300);
  }, [go, later]);

  const answer = useCallback((value: number) => {
    if (isAdvancing) return;
    const nextAnswers = [...answers];
    nextAnswers[current] = value;
    setAnswers(nextAnswers);
    setIsAdvancing(true);

    later(() => {
      setIsAdvancing(false);
      if (current === QUESTIONS.length - 1) finish(nextAnswers);
      else setCurrent(current + 1);
    }, ADVANCE_DELAY);
  }, [answers, current, finish, isAdvancing, later]);

  const back = useCallback(() => {
    if (current === 0 || isAdvancing) return;
    setCurrent(current - 1);
  }, [current, isAdvancing]);

  const next = useCallback(() => {
    if (!answers[current] || isAdvancing) return;
    if (current === QUESTIONS.length - 1) finish(answers);
    else setCurrent(current + 1);
  }, [answers, current, finish, isAdvancing]);

  const exitQuiz = useCallback(() => {
    clearTimers();
    setIsAdvancing(false);
    leave({ name: "intro" });
  }, [clearTimers, leave]);

  const openBird = useCallback((id: string) => go({ name: "bird", id }), [go]);
  const openGallery = useCallback(() => go({ name: "gallery" }), [go]);
  const closePoster = useCallback(() => setPosterOpen(false), []);

  const showIntro = view.name === "intro" || (view.name === "result" && !outcome);
  const bird = view.name === "bird" ? BIRDS_BY_ID[view.id] : null;

  return (
    <main className={`app view-${showIntro ? "intro" : view.name}`}>
      {showIntro && (
        <IntroScreen
          headingRef={headingRef}
          resumeAt={resumeAt}
          lastBird={outcome?.bird ?? null}
          onStart={start}
          onResume={resume}
          onShowLast={() => go({ name: "result" })}
          onGallery={openGallery}
          onOpenBird={openBird}
        />
      )}

      {view.name === "quiz" && (
        <QuizScreen
          index={current}
          answers={answers}
          isAdvancing={isAdvancing}
          onAnswer={answer}
          onBack={back}
          onNext={next}
          onExit={exitQuiz}
        />
      )}

      {view.name === "reveal" && <RevealScreen />}

      {view.name === "result" && outcome && (
        <ResultScreen
          outcome={outcome}
          headingRef={headingRef}
          onPoster={() => setPosterOpen(true)}
          onRestart={start}
          onGallery={openGallery}
          onHome={() => go({ name: "intro" })}
          onOpenBird={openBird}
        />
      )}

      {view.name === "gallery" && (
        <GalleryScreen
          headingRef={headingRef}
          myCode={outcome?.code ?? null}
          onBack={() => leave({ name: "intro" })}
          onOpenBird={openBird}
        />
      )}

      {bird && view.name === "bird" && (
        <BirdScreen
          key={bird.id}
          bird={bird}
          shared={Boolean(view.shared)}
          isMine={bird.code === outcome?.code}
          headingRef={headingRef}
          onBack={() => (view.shared ? go({ name: "intro" }) : leave({ name: "gallery" }))}
          onStart={bird.code === outcome?.code || resumeAt === null ? start : resume}
          onOpenBird={openBird}
        />
      )}

      {posterOpen && view.name === "result" && outcome && <PosterSheet bird={outcome.bird} onClose={closePoster} />}
    </main>
  );
}
