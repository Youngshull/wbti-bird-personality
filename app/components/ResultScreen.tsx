import type { CSSProperties, Ref } from "react";
import type { QuizOutcome } from "../lib/quiz";
import BirdProfile from "./BirdProfile";

type ResultScreenProps = {
  outcome: QuizOutcome;
  headingRef: Ref<HTMLHeadingElement>;
  onPoster: () => void;
  onRestart: () => void;
  onGallery: () => void;
  onHome: () => void;
  onOpenBird: (id: string) => void;
};

export default function ResultScreen({ outcome, headingRef, onPoster, onRestart, onGallery, onHome, onOpenBird }: ResultScreenProps) {
  return (
    <div className="result" style={{ "--accent": outcome.bird.accent } as CSSProperties}>
      <header className="topbar">
        <button type="button" className="logo" onClick={onHome} aria-label="回到 WBTI 首页">
          <strong>WBTI</strong>
          <small>YOUR BIRD<br />TYPE · 2026</small>
        </button>
        <button type="button" className="text-button" onClick={onGallery}>鸟格图鉴</button>
      </header>

      <BirdProfile
        bird={outcome.bird}
        kicker="你的 WBTI 鸟格是"
        axes={outcome.axes}
        headingRef={headingRef}
        onOpenBird={onOpenBird}
        actions={(
          <div className="result-actions">
            <button type="button" className="button button-primary" onClick={onPoster}>生成分享图</button>
            <button type="button" className="button button-secondary" onClick={onRestart}>再测一次</button>
          </div>
        )}
      />

      <footer className="site-footer">
        <div className="footer-actions">
          <button type="button" className="button button-primary" onClick={onPoster}>生成分享图</button>
          <button type="button" className="button button-ghost" onClick={onGallery}>看看另外 15 种鸟格</button>
        </div>
        <p>结果仅供娱乐与自我探索，请勿用于招聘、诊断或重大人生决策。</p>
      </footer>
    </div>
  );
}
