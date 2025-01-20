import move, { type MoveEventCallbackParam, type MoveElType } from "@nimble-ui/move";
import type { SwapOptions, Position, MoveRect, DragAxis, MoveRectList } from "@nimble-ui/types";
import { SWAP_SLOT, SWAP_ITEM, SWAP_ACTIVE } from "@nimble-ui/constant";
import { getParentTarget, animate, html2canvas, swapRect, createId, getAnimateConfig, getDOMRect, setStyle, removeStyle } from "@nimble-ui/utils";

interface DownValue {
  moveSite: MoveRect[];
  cloneDom: Element | null;
  left: number;
  top: number;
  current: Element;
  currentItem: Element | null;
}

function getAllMoveSiteInfo(target: Element, warp: Element): MoveRect[]  {
  const moves = warp.querySelectorAll(`[${SWAP_SLOT}]`);
  const current = getParentTarget(target, (el) => !!el.dataset.swapSlot);
  const moveSite: MoveRect[] = [];
  if (!current) return moveSite;

  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    const id = createId();
    if (el == current) el.setAttribute(SWAP_ACTIVE, 'true');
    const { width, height } = el.getBoundingClientRect();
    moveSite.push({ el, width, height, id })
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
    const active = item.el.getAttribute(SWAP_ACTIVE);
    if (active) continue;
    if (swapRect(point, item.el)) {
      item.item = item.el.querySelector(`[${SWAP_ITEM}]`);
      return item
    };
  }
  return null;
}

// 获取选择的元素
function getActive(el: Element | null) {
  const current = el?.querySelector(`[${SWAP_ACTIVE}]`);
  if (!current) return null;
  return { current, currentItem: current.querySelector(`[${SWAP_ITEM}]`) };
}

// 处理滑动的元素
function calculateSite(dragAxis: DragAxis, { disX, disY, value }: MoveEventCallbackParam) {
  const { cloneDom, left, top, currentItem } = (value.down || {}) as DownValue;
  // 判断锁定方向
  const x = left + (dragAxis == 'both' || dragAxis == 'x' ? disX : 0);
  const y = top + (dragAxis == 'both' || dragAxis == 'y' ? disY : 0);
  setStyle(cloneDom, { opacity: "1", transform: `translate(${x}px, ${y}px)` });
  if (currentItem) setStyle(currentItem, { opacity: '0' });
}

function handleActive(moveSite: MoveRect[], el?: Element) {
  moveSite.forEach((item) => item.el.removeAttribute(SWAP_ACTIVE));
  el && el.setAttribute(SWAP_ACTIVE, 'true');
}

const handleAnimate = (data: MoveEventCallbackParam) => {
  const { value, moveX, moveY, binElement } = data;
  const { moveSite } = (value.down || {}) as DownValue;
  const animateItem = findSwayRect({ x: moveX, y: moveY }, moveSite);
  const active = getActive(binElement!);
  if (!animateItem || animateItem.animate || !active) return;

  const { el, item } = animateItem;
  const { left, top, height, width } = getDOMRect(el);
  const { left: l, top: t, height: h, width: w } = getDOMRect(active.current);
  if (!item) return

  // 修改选择选中的元素
  handleActive(moveSite, el);
  // 设置滑动元素
  animateItem.animate = true;
  active.current.appendChild(animateItem.item!);
  animateItem.el.appendChild(active.currentItem!);
  animate({ x: left - l, y: top - t, width, height }, { x: 0, y: 0, width: w, height: h }, (value, done) => {
    setStyle(item, {
      'z-index': '9999',
      position: "absolute",
      width: `${value.width}px`,
      height: `${value.height}px`,
      transform: `translate(${value.x}px,${value.y}px)`,
    });

    if (done) {
      animateItem.animate = false;
      removeStyle(item, ["transform", "z-index", "position"])
    }
  }, getAnimateConfig("spring"))
}

function goBackSite() {
  
}


export function swap(el: MoveElType, options: SwapOptions) {
  const { dragAxis = 'both', swapMode = 'drop' } = options;
  const { data, observe } = move(el, {
    prevent: true,
    down({ e, binElement }, setValue) {
      const moveSite = getAllMoveSiteInfo(e.target as Element, binElement!);
      const data = getActive(binElement!);
      if (!data) return;

      const rect = data.current?.getBoundingClientRect();
      const cloneDom = cloneNode(data.current, data.currentItem);
      setValue({ ...data, moveSite, cloneDom, left: rect?.left || 0, top: rect?.top || 0  });
    },
    move(data) {
      calculateSite(dragAxis, data);
      swapMode == 'hover' && handleAnimate(data);
    },
    up(data) {
      const { value } = data
      const { cloneDom, moveSite } = (value.down || {}) as DownValue;
      handleActive(moveSite);
      swapMode == 'drop' && handleAnimate(data);
      // 移除克隆元素
      cloneDom && document.body.removeChild(cloneDom);
    },
  });
}