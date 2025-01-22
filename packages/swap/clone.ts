import { html2canvas, setStyle } from "@nimble-ui/utils";

/**
 * 克隆元素
 * @param current 
 * @param item 
 * @returns 
 */
export function cloneNode(current: Element | null, item: Element | null) {
  if (!item || !current) return
  const canvas = html2canvas(item);

  const warp = document.createElement("div");
  const { width, height, left, top } = current.getBoundingClientRect();
  warp.appendChild(canvas);
  setStyle(warp, {
    top: "0",
    left: "0",
    opacity: "0",
    width: `${width}px`,
    height: `${height}px`,
    position: "absolute",
    "z-index": "9999999",
    transform: `translate(${left}px, ${top}px)`
  })
  document.body.appendChild(warp);
  return warp;
}