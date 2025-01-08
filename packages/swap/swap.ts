import move, { type MoveElType } from "@nimble-ui/move";
import type { SwapOptions, MoveRectList, MoveRect } from "@nimble-ui/types";
import { SWAP_TYPE } from "@nimble-ui/constant";
import { getParentTarget, animate, html2canvas } from "@nimble-ui/utils";

function getAllMoveSiteInfo(target: Element, warp: Element) {
  const moves = warp.querySelectorAll(`[${SWAP_TYPE}="move"]`);
  const current = getParentTarget(target, (el) => el.dataset.swapType == 'move');

  const moveSite: MoveRectList = []
  if (!current) return { moveSite, current };

  let currentSite: Omit<MoveRect, 'el'> | null = null;
  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    const { height, width, left, top, bottom, right } = el.getBoundingClientRect();
    if (el == current) {
      currentSite = { height, width, left, top, bottom, right };
    } else {
      moveSite.push({ height, width, left, top, bottom, right, el });
    }
  }

  return { moveSite, current, currentSite };
}

function cloneNode(current: Element | null, content: Element) {
  if (!current) return
  const el = current.cloneNode(true) as Element;
  content.appendChild(el);
  return el as Element;
}

animate({ x: 100, y: 100 }, { x: 0, y: 0 }, (value) => {
  console.log(value)
})

export function swap(el: MoveElType, options: SwapOptions) {
  const { data, observe } = move(el, {
    prevent: true,
    down({ e, binElement }, setValue) {
      const data = getAllMoveSiteInfo(e.target as Element, binElement!);
      html2canvas(data.current!)
      setValue({ ...data, el });
    },
    move({ disY, value }) {
      const { el, currentSite } = value.down || {};
      console.log(currentSite.top + disY);
      el.style.top = `${currentSite.top + disY}px`
    },
    up({ value, binElement }) {
      binElement!.removeChild(value.down.el);
    },
  });
}