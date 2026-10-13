import { assetUrl } from "../lib/asset";
import { birdImage } from "../lib/quiz";

type BirdArtProps = {
  id: string;
  alt?: string;
  sizes?: string;
  eager?: boolean;
  className?: string;
};

/** 优先加载压缩后的 WebP，JPG 只作兜底。 */
export default function BirdArt({ id, alt = "", sizes = "(min-width: 900px) 420px, 70vw", eager = false, className }: BirdArtProps) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={`${birdImage(id, 480)} 480w, ${birdImage(id, 960)} 960w`} sizes={sizes} />
      <img
        src={assetUrl(`/birds-v3/${id}.jpg`)}
        alt={alt}
        width={960}
        height={960}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}
