/** 把 public/ 下的路径拼上部署前缀：正式站是 “/”，GitHub Pages 预览是 “/wbti-bird-personality/”。 */
export function assetUrl(path: string) {
  const base = import.meta.env?.BASE_URL ?? "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
