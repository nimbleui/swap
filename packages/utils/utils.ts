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