import move, { type MoveEventCallbackParam, type MoveElType } from "@nimble-ui/move";
import type { SwapOptions, Position, MoveRect, DragAxis, MoveRectList } from "@nimble-ui/types";
import { SWAP_SLOT, SWAP_ITEM, SWAP_ACTIVE, SWAP_ID } from "@nimble-ui/constant";
import { getParentTarget, animate, html2canvas, swapRect, getAnimateConfig, getDOMRect, setStyle, removeStyle } from "@nimble-ui/utils";

interface DownValue {
  moveSite: MoveRect[];
  cloneDom: Element | null;
  left: number;
  top: number;
  current: Element;
  child: Element;
}

function getAllMoveSiteInfo(target: Element, warp: Element): MoveRect[]  {
  const moves = warp.querySelectorAll(`[${SWAP_SLOT}]`);
  const current = getParentTarget(target, (el) => {
    const value = el.dataset.swapSlot
    return value === '' || !!value
  });
  const moveSite: MoveRect[] = [];
  if (!current) return moveSite;

  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    const item = el.querySelector(`[${SWAP_ITEM}]`);
    el == current && item?.setAttribute(SWAP_ACTIVE, '');
    const { width, height } = el.getBoundingClientRect();
    moveSite.push({ el, width, height })
  }
  return moveSite;
}

// 克隆元素
function cloneNode(current: Element | null, item: Element | null) {
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

// 查找交叉的元素
function findSwayRect(point: Position, moveSite: MoveRectList) {
  for (let i = 0; i < moveSite.length; i++) {
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

// 获取选择的元素
function getActive(el: Element | null) {
  const child = el?.querySelector(`[${SWAP_ACTIVE}]`);
  if (!child) return null;
  return { current: child.parentElement!, child };
}

// 处理滑动的元素
function calculateSite(dragAxis: DragAxis, { disX, disY, value }: MoveEventCallbackParam) {
  const { cloneDom, left, top, child } = (value.down || {}) as DownValue;
  // 判断锁定方向
  const x = left + (dragAxis == 'both' || dragAxis == 'x' ? disX : 0);
  const y = top + (dragAxis == 'both' || dragAxis == 'y' ? disY : 0);
  setStyle(cloneDom, { opacity: "1", transform: `translate(${x}px, ${y}px)` });
  if (child) setStyle(child, { opacity: '0' });
}


const handleAnimate = (data: MoveEventCallbackParam, options: SwapOptions) => {
  const { value, moveX, moveY, binElement } = data;
  const { moveSite } = (value.down || {}) as DownValue;
  const animateItem = findSwayRect({ x: moveX, y: moveY }, moveSite);
  const active = getActive(binElement!);
  if (!animateItem || animateItem.animate || !active) return;

  const { el, child } = animateItem;
  const { left, top, height, width } = getDOMRect(el);
  const { left: l, top: t, height: h, width: w } = getDOMRect(active.current);
  if (!child) return

  // 设置滑动元素
  animateItem.animate = true;
  const id = animateItem.el.getAttribute(SWAP_ID);
  const currentId = active.current.getAttribute(SWAP_ID);
  options.onSwapStart?.(id, currentId);
  // active.current.appendChild(animateItem.item!);
  // animateItem.el.appendChild(active.currentItem!);
  animate({ x: left - l, y: top - t, width, height }, { x: 0, y: 0, width: w, height: h }, (value, done) => {
    setStyle(child, {
      'z-index': '9999',
      position: "absolute",
      width: `${value.width}px`,
      height: `${value.height}px`,
      transform: `translate(${value.x}px,${value.y}px)`,
    });

    if (done) {
      const id = animateItem.el.getAttribute(SWAP_ID);
      const currentId = active.current.getAttribute(SWAP_ID);
      options.onSwap?.(id, currentId);

      animateItem.animate = false;
      removeStyle(child, ["transform", "z-index", "position", "width", "height"]);
    }
  }, getAnimateConfig("spring"))
}

function goBackSite(clone: Element | null, content: Element) {
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
  }, getAnimateConfig("spring"))
}

function removeActive(el?: Element) {
  const list = el?.querySelectorAll(`[${SWAP_ACTIVE}]`);
  list?.forEach((el) => el.removeAttribute(SWAP_ACTIVE));
}

export function swap(el: MoveElType, options: SwapOptions) {
  const { dragAxis = 'both', swapMode = 'drop' } = options;
  move(el, {
    prevent: true,
    down({ e, binElement }, setValue) {
      // 移除选中的状态
      removeActive(binElement);
      const moveSite = getAllMoveSiteInfo(e.target as Element, binElement!);
      const data = getActive(binElement!);
      if (!data) return;

      const rect = data.current?.getBoundingClientRect();
      const cloneDom = cloneNode(data.current, data.child);
      setValue({ ...data, moveSite, cloneDom, left: rect?.left || 0, top: rect?.top || 0  });
    },
    move(data) {
      calculateSite(dragAxis, data);
      swapMode == 'hover' && handleAnimate(data, options);
    },
    up(data) {
      const { value, binElement } = data
      const { cloneDom } = (value.down || {}) as DownValue;
      swapMode == 'drop' && handleAnimate(data, options);
      goBackSite(cloneDom, data.binElement!);
      // 移除选中的状态
      removeActive(binElement);
      // 移除克隆元素
      cloneDom && document.body.removeChild(cloneDom);
    },
  });
}