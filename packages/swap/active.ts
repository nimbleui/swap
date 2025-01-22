import { SWAP_ACTIVE } from "@nimble-ui/constant";

// 获取选择的元素
export function getActive(el: Element | null) {
  const child = el?.querySelector(`[${SWAP_ACTIVE}]`);
  if (!child) return null;
  return { current: child.parentElement!, child };
}

// 移除选择的状态
export function removeActive(el?: Element) {
  const list = el?.querySelectorAll(`[${SWAP_ACTIVE}]`);
  list?.forEach((el) => el.removeAttribute(SWAP_ACTIVE));
}
