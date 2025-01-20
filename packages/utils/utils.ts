import { MoveRect, Position, RectInfo } from "@nimble-ui/types";

export function isFunction(el: unknown): el is Function {
  return typeof el === 'function';
}

export function isFunctionOrValue<T>(
  val: T
): T extends (...args: any) => any ? ReturnType<T> : T {
  return isFunction(val) ? val() : val;
}

export function getParentTarget(
  element: Element,
  polyfill: (el: HTMLElement) => boolean
) {
  let parent = element as HTMLElement | null;
  while (parent) {
    if (polyfill(parent)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

export function getDOMRect(el: null): null;
export function getDOMRect(el: Element): RectInfo;
export function getDOMRect(el: Element | null) {
  if (!el) return null;
  const { left, top, height, width } = el.getBoundingClientRect();

  return { left, top, height, width }
}

export function swapRect(point: Position, el: null): false;
export function swapRect(point: Position, el: Element): boolean;
export function swapRect(point: Position, el: Element | null) {
  if (!el) return false
  const rect = getDOMRect(el);
  return (
    point.x >= rect.left &&
    point.x <= rect.left + rect.width &&
    point.y >= rect.top &&
    point.y <= rect.top + rect.height
  )
}

export function createId() {
  return Math.random().toString(36).substring(2);
}

export function setStyle(el: Element| null, obj: {[key: string]: string}) {
  if (!el) return
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    (el as HTMLElement).style.setProperty(key, obj[key]);
  }
}

export function removeStyle(el: Element | null, keys: string[]) {
  if (!el) return
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    (el as HTMLElement).style.removeProperty(key);
    
  }
}
