import type { Ref } from "react";
import { AXES, type BirdType } from "../lib/quiz";
import BirdProfile from "./BirdProfile";

type BirdScreenProps = {
  bird: BirdType;
  shared: boolean;
  isMine: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  onBack: () => void;
  onStart: () => void;
  onOpenBird: (id: string) => void;
};

export default function BirdScreen({ bird, shared, isMine, headingRef, onBack, onStart, onOpenBird }: BirdScreenProps) {
  return (
    <div className="bird-page">
      <header className="topbar">
        <button type="button" className="text-button" onClick={onBack}>{shared ? "WBTI 首页" : "← 返回"}</button>
        <span className="topbar-title">鸟格图鉴</span>
        <span className="topbar-spacer" aria-hidden="true" />
      </header>

      {shared && <p className="shared-banner">朋友分享给你一只鸟格。你会是哪一只？</p>}

      <BirdProfile
        bird={bird}
        kicker={isMine ? "这是你的鸟格" : AXES.map((axis, index) => (bird.code[index] === "+" ? axis.plus : axis.minus)).join(" · ")}
        headingRef={headingRef}
        onOpenBird={onOpenBird}
        actions={(
          <div className="result-actions">
            <button type="button" className="button button-primary" onClick={onStart}>
              {isMine ? "再测一次" : "测测我是哪只鸟"} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      />
    </div>
  );
}
