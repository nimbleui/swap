import move, { type MoveEventCallbackParam, type MoveElType } from "@nimble-ui/move";
import type { SwapOptions, MoveRect, DragAxis, SwapDownValue } from "@nimble-ui/types";
import { SWAP_SLOT, SWAP_ITEM, SWAP_ACTIVE } from "@nimble-ui/constant";
import { getDOMRect, getParentTarget, isFunctionOrValue, setStyle } from "@nimble-ui/utils";
import { cloneNode } from "./clone";
import { getActive, removeActive } from "./active";
import { goBackAnimate, handleAnimate } from "./animate";
import { handleModel } from "./model";

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

// 处理滑动的元素
function calculateSite(dragAxis: DragAxis, { disX, disY, value }: MoveEventCallbackParam) {
  const { cloneDom, left, top, child } = (value.down || {}) as SwapDownValue;
  // 判断锁定方向
  const x = left + (dragAxis == 'both' || dragAxis == 'x' ? disX : 0);
  const y = top + (dragAxis == 'both' || dragAxis == 'y' ? disY : 0);
  setStyle(cloneDom, { opacity: "1", transform: `translate(${x}px, ${y}px)` });
  if (child) setStyle(child, { opacity: '0' });
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
      const { cloneDom } = (value.down || {}) as SwapDownValue;

      handleModel(data, options);
      // 移除选中的状态
      removeActive(binElement);
      // 移除克隆元素
      cloneDom && document.body.removeChild(cloneDom);
    },
  });
}