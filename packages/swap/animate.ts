import { SWAP_ACTIVE, SWAP_ITEM } from "@nimble-ui/constant";
import { MoveEventCallbackParam } from "@nimble-ui/move";
import { AnimationType, MoveRectList, Position, SwapDownValue, SwapOptions } from "@nimble-ui/types";
import { animate, getAnimateConfig, getDOMRect, removeStyle, setStyle, swapRect } from "@nimble-ui/utils";
import { getActive } from "./active";
import { swapElement } from "./swapElement";

// 查找交叉的元素
function findSwayRect(point: Position, moveSite: MoveRectList) {
  for (let i = 0; i < moveSite?.length; i++) {
    const item = moveSite[i];
    const child = item.el.querySelector(`[${SWAP_ITEM}]`)
    const active = child?.getAttribute(SWAP_ACTIVE);
    if (active) continue;
    if (swapRect(point, item.el)) {
      item.child = child;
      return item
    };
  }
  return null;
}

/**
 * 处理交换的动画
 * @param data 
 * @param options 
 * @returns 
 */
export const handleAnimate = (data: MoveEventCallbackParam, options: SwapOptions) => {
  const { value, moveX, moveY, binElement } = data;
  const { moveSite } = (value.down || {}) as SwapDownValue;
  const animateItem = findSwayRect({ x: moveX, y: moveY }, moveSite);
  const active = getActive(binElement!);
  if (!animateItem || animateItem.animate || !active) return;

  const { el, child } = animateItem;
  const { left, top, height, width } = getDOMRect(el);
  const { left: l, top: t, height: h, width: w } = getDOMRect(active.current);
  if (!child) return

  // 设置滑动元素
  animateItem.animate = true;
  const { id, currentId } = swapElement(animateItem, active, options)
  options.onSwapStart?.(id, currentId);
  animate({ x: left - l, y: top - t, width, height }, { x: 0, y: 0, width: w, height: h }, (value, done) => {
    setStyle(child, {
      'z-index': '9999',
      position: "absolute",
      width: `${value.width}px`,
      height: `${value.height}px`,
      transform: `translate(${value.x}px,${value.y}px)`,
    });

    if (done) {
      options.onSwapEnd?.(id, currentId);
      animateItem.animate = false;
      removeStyle(child, ["transform", "z-index", "position", "width", "height"]);
    }
  }, getAnimateConfig(options.animation || 'dynamic'))
}

/**
 * 松开回到原位置
 * @param clone 
 * @param content 
 * @param animation 
 * @returns 
 */
export function goBackAnimate(clone: Element | null, content: Element, animation: AnimationType = 'dynamic') {
  if (!clone) return
  const { left, top } = getDOMRect(clone);
  const active = getActive(content);
  if (!active) return;

  const { left: l, top: t, width: w, height: h } = getDOMRect(active.child);
  setStyle(active.child, { opacity: '1' });
  animate({ x: left - l, y: top - t, w, h }, { x: 0, y: 0, w, h }, (value, done) => {
    setStyle(active.child, {
      width: `${w}px`,
      height: `${h}px`,
      'z-index': '9999',
      position: "absolute",
      transform: `translate(${value.x}px,${value.y}px)`,
    });

    if (done) {
      removeStyle(active.child, ["transform", "z-index", "position", 'width', 'height', 'opacity', 'left', 'top'])
    }
  }, getAnimateConfig(animation))
}
