import { useEffect, useRef } from "react";
import { assetUrl } from "../lib/asset";
import { displayOptions, QUESTIONS } from "../lib/quiz";

const OPTION_MARKS = ["A", "B", "C", "D"];
const MILESTONES: Record<number, string> = {
  6: "已完成 1/4 · 你的羽毛颜色出来了",
  12: "过半啦 · 鸟格轮廓越来越清楚",
  18: "最后 6 题 · 马上揭晓",
};

type QuizScreenProps = {
  index: number;
  answers: number[];
  isAdvancing: boolean;
  onAnswer: (value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
};

export default function QuizScreen({ index, answers, isAdvancing, onAnswer, onBack, onNext, onExit }: QuizScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const question = QUESTIONS[index];
  const options = displayOptions(index);
  const selected = answers[index];
  const answeredCount = answers.filter(Boolean).length;
  const progress = ((index + (selected ? 1 : 0)) / QUESTIONS.length) * 100;

  // 每换一题把焦点移到题干，键盘和读屏用户都能从新题开始。
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const key = event.key.toUpperCase();
      const optionIndex = "1234".includes(key) ? Number(key) - 1 : OPTION_MARKS.indexOf(key);
      if (optionIndex >= 0 && options[optionIndex]) {
        event.preventDefault();
        onAnswer(options[optionIndex].value);
      } else if (event.key === "ArrowLeft") {
        onBack();
      } else if (event.key === "ArrowRight" && selected) {
        onNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onAnswer, onBack, onNext, options, selected]);

  return (
    <div className="quiz">
      <header className="quiz-top">
        <button type="button" className="icon-button" onClick={onExit} aria-label="暂停答题，回到首页">
          <span aria-hidden="true">×</span>
        </button>
        <div
          className="progress"
          role="progressbar"
          aria-label="答题进度"
          aria-valuemin={0}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={answeredCount}
          aria-valuetext={`已答 ${answeredCount} 题，共 ${QUESTIONS.length} 题`}
        >
          <span className="progress-fill" style={{ width: `${progress}%` }} />
          <img className="progress-bird" src={assetUrl("/icons/progress-bird.webp")} alt="" style={{ left: `clamp(12px, ${progress}%, calc(100% - 12px))` }} />
        </div>
        <span className="quiz-count"><b>{index + 1}</b>/{QUESTIONS.length}</span>
      </header>

      <div className="quiz-main">
        {MILESTONES[index] && <p className="milestone" role="status">{MILESTONES[index]}</p>}

        <section className="question-card" key={question.id} aria-labelledby="question-title">
          <p className="question-kicker">Q{String(index + 1).padStart(2, "0")} · 请代入这个现场</p>
          <h1 id="question-title" ref={headingRef} tabIndex={-1}>{question.scene}</h1>
          <p className="question-hint">{question.hint}</p>

          <div className="option-list" role="group" aria-labelledby="question-title">
            {options.map((option, optionIndex) => {
              const isSelected = selected === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  className={`option${isSelected ? " is-selected" : ""}`}
                  aria-pressed={isSelected}
                  aria-disabled={isAdvancing}
                  onClick={() => onAnswer(option.value)}
                >
                  <span className="option-mark" aria-hidden="true">{isSelected ? "✓" : OPTION_MARKS[optionIndex]}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="quiz-bottom">
        <button type="button" className="text-button" onClick={onBack} disabled={index === 0}>← 上一题</button>
        <span className="quiz-tip">凭第一反应选，通常更准</span>
        {selected ? (
          <button type="button" className="text-button" onClick={onNext}>下一题 →</button>
        ) : (
          <span className="quiz-keys" aria-hidden="true">键盘 1–4 也能选</span>
        )}
      </footer>
    </div>
  );
}
