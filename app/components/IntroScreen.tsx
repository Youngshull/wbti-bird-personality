import type { Ref } from "react";
import { BIRD_TYPES, BIRDS_BY_ID, QUESTIONS, type BirdType } from "../lib/quiz";
import { assetUrl } from "../lib/asset";
import BirdArt from "./BirdArt";

const HERO_BIRDS = ["care-pack", "nailed-it", "hype-buddy"].map((id) => BIRDS_BY_ID[id]);

type IntroScreenProps = {
  headingRef: Ref<HTMLHeadingElement>;
  resumeAt: number | null;
  lastBird: BirdType | null;
  onStart: () => void;
  onResume: () => void;
  onShowLast: () => void;
  onGallery: () => void;
  onOpenBird: (id: string) => void;
};

export default function IntroScreen({ headingRef, resumeAt, lastBird, onStart, onResume, onShowLast, onGallery, onOpenBird }: IntroScreenProps) {
  return (
    <div className="intro">
      <header className="topbar">
        <span className="logo" aria-label="WBTI 鸟格测试">
          <strong>WBTI</strong>
          <small>WHICH BIRD<br />TYPE INDICATOR</small>
        </span>
        <button type="button" className="text-button" onClick={onGallery}>鸟格图鉴</button>
      </header>

      <section className="intro-hero" aria-labelledby="intro-title">
        <div className="hero-stage" aria-hidden="true">
          {HERO_BIRDS.map((bird, index) => (
            <div className={`hero-card hero-card-${index + 1}`} key={bird.id}>
              <BirdArt id={bird.id} eager sizes="(min-width: 900px) 320px, 62vw" />
            </div>
          ))}
          <img className="hero-sticker" src={assetUrl("/icons/jiangtun-sticker.webp")} alt="" width={480} height={480} />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">WHICH BIRD ARE YOU TODAY?</p>
          <h1 id="intro-title" ref={headingRef} tabIndex={-1}>今天的你，<br />是哪一只<span>鸟</span>？</h1>
          <p className="hero-lead">
            {QUESTIONS.length} 个日常小现场，测出你的行动节奏、社交电量、计划偏好和决策方式，再认识一只和你很像的真实鸟类。
          </p>

          <div className="hero-actions">
            {resumeAt === null ? (
              <button type="button" className="button button-primary" onClick={onStart}>
                开始测试 <span aria-hidden="true">→</span>
              </button>
            ) : (
              <>
                <button type="button" className="button button-primary" onClick={onResume}>
                  继续答题 · 第 {resumeAt + 1} 题 <span aria-hidden="true">→</span>
                </button>
                <button type="button" className="button button-secondary" onClick={onStart}>从头开始</button>
              </>
            )}
          </div>

          <ul className="hero-facts" aria-label="测试信息">
            <li><b>{QUESTIONS.length}</b> 道题</li>
            <li><b>3</b> 分钟左右</li>
            <li><b>16</b> 种鸟格</li>
          </ul>

          {lastBird && (
            <button type="button" className="last-result" onClick={onShowLast}>
              <BirdArt id={lastBird.id} sizes="56px" />
              <span>上次测出的你是<b>{lastBird.name}</b></span>
              <i aria-hidden="true">查看 →</i>
            </button>
          )}
        </div>
      </section>

      <section className="intro-gallery" aria-labelledby="gallery-title">
        <div className="section-head">
          <p className="eyebrow">16 TYPES · 16 REAL BIRDS</p>
          <h2 id="gallery-title">16 种鸟格，16 种真实的鸟</h2>
          <p>从屋檐下的家燕到湖面上的大天鹅，每种鸟格都对应一种真实鸟类。测完你会知道自己像哪只鸟，也会认识它的一个小习性。</p>
        </div>
        <ul className="bird-strip">
          {BIRD_TYPES.map((bird) => (
            <li key={bird.id}>
              <button type="button" onClick={() => onOpenBird(bird.id)} aria-label={`查看${bird.name}（${bird.species}）`}>
                <BirdArt id={bird.id} sizes="120px" />
                <span>{bird.species}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="button button-ghost" onClick={onGallery}>翻开完整图鉴</button>
      </section>

      <footer className="site-footer">
        <p>⌖ 湖口 · 鄱阳湖 &nbsp;·&nbsp; 记录自然，遇见自己</p>
        <p>无需登录，答案只保存在你的设备上。结果仅供娱乐与自我探索。</p>
      </footer>
    </div>
  );
}
