import type { CSSProperties, Ref } from "react";
import { BIRD_TYPES } from "../lib/quiz";
import BirdArt from "./BirdArt";

type GalleryScreenProps = {
  headingRef: Ref<HTMLHeadingElement>;
  myCode: string | null;
  onBack: () => void;
  onOpenBird: (id: string) => void;
};

export default function GalleryScreen({ headingRef, myCode, onBack, onOpenBird }: GalleryScreenProps) {
  return (
    <div className="gallery">
      <header className="topbar">
        <button type="button" className="text-button" onClick={onBack}>← 返回</button>
        <span className="topbar-title">鸟格图鉴</span>
        <span className="topbar-spacer" aria-hidden="true" />
      </header>

      <div className="section-head">
        <p className="eyebrow">FIELD GUIDE · 16 BIRD TYPES</p>
        <h1 ref={headingRef} tabIndex={-1}>16 种鸟格图鉴</h1>
        <p>每种鸟格由四个维度组合而成，也各自对应一种真实鸟类。点开任意一只，看看它的性格和习性。</p>
      </div>

      <ul className="gallery-grid">
        {BIRD_TYPES.map((bird) => (
          <li key={bird.id}>
            <button
              type="button"
              className={`gallery-card${bird.code === myCode ? " is-mine" : ""}`}
              style={{ "--accent": bird.accent } as CSSProperties}
              onClick={() => onOpenBird(bird.id)}
            >
              {bird.code === myCode && <span className="mine-badge">你的鸟格</span>}
              <span className="gallery-number">No.{String(bird.number).padStart(2, "0")}</span>
              <BirdArt id={bird.id} sizes="(min-width: 900px) 220px, 42vw" />
              <b>{bird.name}</b>
              <small>{bird.species}</small>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
