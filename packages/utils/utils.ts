import { MoveRect, Position } from "@nimble-ui/types";

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

export function swapRect(point: Position, rect: MoveRect) {
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
