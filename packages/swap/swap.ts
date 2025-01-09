import move, { type MoveElType } from "@nimble-ui/move";
import type { SwapOptions, MoveRectObj, Position } from "@nimble-ui/types";
import { SWAP_TYPE } from "@nimble-ui/constant";
import { getParentTarget, animate, html2canvas, swapRect, createId, getAnimateConfig } from "@nimble-ui/utils";

function getAllMoveSiteInfo(target: Element, warp: Element) {
  const moves = warp.querySelectorAll(`[${SWAP_TYPE}="move"]`);
  const current = getParentTarget(target, (el) => el.dataset.swapType == 'move');

  const moveSite: MoveRectObj = {}
  let activeId: string = '';
  if (!current) return { moveSite, current, activeId };

  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    const { height, width, left, top, bottom, right } = el.getBoundingClientRect();
    const id = createId();
    if (el == current) activeId = id;
    moveSite[id] = { height, width, left, top, bottom, right, el}
  }

  return { moveSite, current, activeId, currentSite: moveSite[activeId]  };
}

function cloneNode(current: Element | null) {
  if (!current) return
  const canvas = html2canvas(current);

  const warp = document.createElement("div");
  const { width, height, left, top } = current.getBoundingClientRect();
  warp.appendChild(canvas);
  warp.style.setProperty("opacity", "0");
  warp.style.setProperty('width', `${width}px`);
  warp.style.setProperty('height', `${height}px`);
  warp.style.setProperty("position", "absolute");
  warp.style.setProperty('transform', `translate(${left}px, ${top}px)`);

  document.body.appendChild(warp);
  return warp;
}

// animate({ x: 100, y: 100 }, { x: 0, y: 0 }, (value) => {
//   console.log(value)
// })

function findSwayRect(point: Position, moveSite: MoveRectObj, activeId: string) {
  const ids = Object.keys(moveSite);

  let swapId = ''
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const site = moveSite[id];
    if (activeId != id && swapRect(point, site)) {
      swapId = id
      break;
    }
  }
  return swapId
}

export function swap(el: MoveElType, options: SwapOptions) {
  const { dragAxis = 'both', swapMode = 'drop' } = options;
  const { data, observe } = move(el, {
    prevent: true,
    down({ e, binElement }, setValue) {
      const data = getAllMoveSiteInfo(e.target as Element, binElement!)
      const cloneDom = cloneNode(data.current);

      setValue({ ...data, cloneDom });
    },
    move({ disY, disX, value, moveX, moveY }) {
      const { cloneDom, activeId, moveSite, currentSite } = value.down || {};
      // 判断锁定方向
      const { left = 0, top = 0 } = currentSite;
      const x = left + (dragAxis == 'both' || dragAxis == 'x' ? disX : 0);
      const y = top + (dragAxis == 'both' || dragAxis == 'y' ? disY : 0);
      cloneDom.style.setProperty("opacity", "0.4");
      cloneDom.style.setProperty('transform', `translate(${x}px, ${y}px)`);

      if (swapMode != 'hover') return;
      const id = findSwayRect({ x: moveX, y: moveY }, moveSite, activeId);
      const item = moveSite[id];
      if (!id || item.animate) return;

      moveSite[id].animate = true;
      const { left: l, top: t } = moveSite[activeId];
      moveSite[id] = moveSite[activeId];
      moveSite[activeId] = item;
      animate({ x: 0, y: 0 }, { x: l - item.left, y: t - item.top }, (value, done) => {
        item.el.style.setProperty('transform', `translate(${value.x}px, ${value.y}px)`);
        if (done) {
          item.animate = false;
        }
      }, getAnimateConfig("spring"))
    },
    up({ value }) {
      document.body.removeChild(value.down.cloneDom);
    },
  });
}