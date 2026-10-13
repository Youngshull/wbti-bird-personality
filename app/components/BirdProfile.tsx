import type { CSSProperties, ReactNode, Ref } from "react";
import { partnerOf, partnerReason, type AxisResult, type BirdType } from "../lib/quiz";
import BirdArt from "./BirdArt";

type BirdProfileProps = {
  bird: BirdType;
  kicker: string;
  axes?: AxisResult[];
  headingRef?: Ref<HTMLHeadingElement>;
  onOpenBird: (id: string) => void;
  actions?: ReactNode;
};

export default function BirdProfile({ bird, kicker, axes, headingRef, onOpenBird, actions }: BirdProfileProps) {
  const partner = partnerOf(bird);

  return (
    <article className="profile" style={{ "--accent": bird.accent } as CSSProperties}>
      <div className="profile-hero">
        <div className="profile-art">
          <span className="profile-number">No.{String(bird.number).padStart(2, "0")}</span>
          <BirdArt id={bird.id} alt={`${bird.name}：${bird.species}的水彩场景插画`} eager sizes="(min-width: 900px) 440px, 84vw" />
        </div>

        <div className="profile-title">
          <p className="profile-kicker">{kicker}</p>
          <h1 ref={headingRef} tabIndex={-1}>{bird.name}</h1>
          <p className="profile-english">{bird.english}</p>
          <p className="profile-species">
            <span>原型鸟</span>
            <b>{bird.species}</b>
            <small>{bird.speciesEnglish}</small>
          </p>
          <p className="profile-tagline">“{bird.tagline}”</p>
          <ul className="trait-list" aria-label="关键词">
            {bird.traits.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
          {actions}
        </div>
      </div>

      <div className="profile-body">
        {axes && (
          <section className="profile-section" aria-labelledby="axes-title">
            <h2 id="axes-title">你的四维鸟格</h2>
            <ul className="axis-list">
              {axes.map(({ axis, pole, strength }) => {
                const position = pole === "+" ? strength : 100 - strength;
                return (
                  <li key={axis.id}>
                    <div className="axis-head">
                      <span>{axis.name}</span>
                      <b>{strength === 50 ? `势均力敌 · 略偏${pole === "+" ? axis.plus : axis.minus}` : `${strength}% ${pole === "+" ? axis.plus : axis.minus}`}</b>
                    </div>
                    <div className="axis-track" aria-hidden="true">
                      <span className="axis-fill" style={{ left: pole === "+" ? "50%" : `${position}%`, width: `${Math.abs(position - 50)}%` }} />
                      <span className="axis-dot" style={{ left: `${position}%` }} />
                    </div>
                    <div className="axis-poles" aria-hidden="true">
                      <span className={pole === "-" ? "active" : ""}>{axis.minus}</span>
                      <span className={pole === "+" ? "active" : ""}>{axis.plus}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="profile-section" aria-labelledby="about-title">
          <h2 id="about-title">{axes ? "你是这样的鸟" : "这只鸟格的人"}</h2>
          <p>{bird.body}</p>
        </section>

        <section className="profile-section field-note" aria-labelledby="note-title">
          <h2 id="note-title">观鸟笔记 · {bird.species}</h2>
          <p>{bird.birdNote}</p>
        </section>

        <section className="profile-section" aria-labelledby="watch-title">
          <h2 id="watch-title">给{axes ? "你" : "TA"}的小提醒</h2>
          <p>{bird.watchOut}</p>
        </section>

        <section className="profile-section" aria-labelledby="partner-title">
          <h2 id="partner-title">最佳搭子</h2>
          <button
            type="button"
            className="partner-card"
            style={{ "--accent": partner.accent } as CSSProperties}
            onClick={() => onOpenBird(partner.id)}
          >
            <BirdArt id={partner.id} sizes="96px" />
            <span>
              <b>{partner.name}</b>
              <small>{partner.species} · {partner.english}</small>
            </span>
            <i aria-hidden="true">→</i>
          </button>
          <p className="partner-reason">{partnerReason(bird)}</p>
        </section>
      </div>
    </article>
  );
}
