import { useEffect, useMemo, useRef, useState } from "react";
import { createPoster, SITE_URL, type Poster } from "../lib/poster";
import type { BirdType } from "../lib/quiz";

type PosterSheetProps = {
  bird: BirdType;
  onClose: () => void;
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 微信等内置浏览器可能没有剪贴板接口，退回旧写法。
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }
}

export default function PosterSheet({ bird, onClose }: PosterSheetProps) {
  const [poster, setPoster] = useState<Poster | null>(null);
  const [failed, setFailed] = useState(false);
  const [notice, setNotice] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const shareUrl = `${SITE_URL}/?bird=${bird.id}`;
  const shareText = `我的 WBTI 鸟格是「${bird.name}」，原型鸟是${bird.species}——${bird.tagline}。你是哪一只鸟？`;
  const isWeChat = useMemo(() => typeof navigator !== "undefined" && /MicroMessenger/i.test(navigator.userAgent), []);

  useEffect(() => {
    let cancelled = false;
    createPoster(bird)
      .then((result) => !cancelled && setPoster(result))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [bird]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose]);

  const posterFile = useMemo(() => (poster ? new File([poster.blob], poster.fileName, { type: "image/jpeg" }) : null), [poster]);
  const canShareFile = Boolean(posterFile && typeof navigator.canShare === "function" && navigator.canShare({ files: [posterFile] }));

  const sharePoster = async () => {
    if (!posterFile) return;
    try {
      await navigator.share({ files: [posterFile], title: "WBTI 鸟格测试", text: shareText });
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") setNotice("系统分享没有成功，可以先保存图片再发送。");
    }
  };

  const copyLink = async () => {
    const copied = await copyText(`${shareText} ${shareUrl}`);
    setNotice(copied ? "链接和一句话介绍已复制，去粘贴给朋友吧。" : "复制没有成功，请长按下方链接手动复制。");
  };

  return (
    <div className="sheet-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet-head">
          <h2 id="sheet-title">分享我的鸟格</h2>
          <button type="button" ref={closeRef} className="icon-button" onClick={onClose} aria-label="关闭分享面板">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="poster-frame">
          {poster ? (
            <img src={poster.url} alt={`${bird.name}鸟格分享图`} />
          ) : (
            <p className="poster-status">{failed ? "分享图生成失败，可以直接截图分享。" : "正在画你的鸟格观察卡…"}</p>
          )}
        </div>

        <p className="sheet-hint">
          {isWeChat ? "长按上面的图片，可以保存到相册或直接发给朋友。" : "保存图片后，就可以发到朋友圈、群聊或小红书。"}
        </p>

        <div className="sheet-actions">
          {canShareFile && <button type="button" className="button button-primary" onClick={sharePoster}>分享图片</button>}
          {poster && !isWeChat && (
            <a className={`button ${canShareFile ? "button-secondary" : "button-primary"}`} href={poster.url} download={poster.fileName}>
              保存图片
            </a>
          )}
          <button type="button" className="button button-secondary" onClick={copyLink}>复制链接</button>
        </div>

        <p className="sheet-link">{shareUrl}</p>
        <p className="sheet-notice" role="status">{notice}</p>
      </div>
    </div>
  );
}
