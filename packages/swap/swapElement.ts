import { SWAP_ID } from "@nimble-ui/constant";
import { MoveRect, SwapOptions } from "@nimble-ui/types";
import { isFunctionOrValue } from "@nimble-ui/utils";

/**
 * 交换元素
 * @param animateItem 
 * @param active 
 * @param options 
 * @returns 
 */
export function swapElement(
  animateItem: MoveRect,
  active: { current: HTMLElement; child: Element; },
  options: SwapOptions
) {
  const id = animateItem.el.getAttribute(SWAP_ID);
  const currentId = active.current.getAttribute(SWAP_ID);
  const { items, keyField } = options;
  const list = isFunctionOrValue(items);
  if (list) {
    let idIndex: number | null = null;
    let currentIndex: number | null = null;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (keyField) {
        item[keyField] == id && (idIndex = i);
        item[keyField] == currentId && (currentIndex = i);
      } else {
        item == id && (idIndex = i);
        item == currentId && (currentIndex = i);
      }
    }

    if (idIndex != null && currentIndex != null) {
      list[idIndex] = list.splice(+currentIndex, 1, list[idIndex])[0];
    }
  } else {
    active.current.appendChild(animateItem.child!);
    animateItem.el.appendChild(active.child!);
  }

  return { id, currentId };
}
