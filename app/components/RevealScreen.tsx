export default function RevealScreen() {
  return (
    <div className="reveal" role="status" aria-live="polite">
      <div className="reveal-cards" aria-hidden="true">
        <span /><span /><span />
      </div>
      <p>正在翻阅 16 种鸟类图鉴…</p>
      <div className="reveal-line" aria-hidden="true"><span /></div>
    </div>
  );
}
