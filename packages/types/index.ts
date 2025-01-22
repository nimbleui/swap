type ModelType = 'swap' | 'drag' | 'both'

export type AnimationType = "dynamic" | "spring" | "none";
export type AnimateConfig = {
  duration: number
  easing: (t: number) => number
}

export type Vec2 = { x: number; y: number };

export type Position = { x: number; y: number };
export type DragAxis = "both" | "y" | "x";
export type SwapMode = "hover" | "drop"

type Types<T> = T | (() => T)

export interface SwapOptions {
  model?: ModelType;
  /** 容器 */
  current?: Types<Element>;
  /** 是否自动滑动滚动条 */
  autoScroll?: boolean;
  /** 动画 */
  animation?: AnimationType;
  /** 交换方式 */
  swapMode?: SwapMode;
  /** 锁定拖拽方向 */
  dragAxis?: DragAxis;
  /** 拖拽到目标函数 */
  dropTarget?: Types<Element>;
  /** 列表 mvvn、mvc框架必须传值 */
  items?: Types<any[]>;
  /** 列表中唯一key */
  keyField?: string;
  /** 开始交换回调函数 */
  onSwapStart?: (id: string | null, currentId: string | null) => void;
  /** 交换中回调函数 */
  onSwap?: (id: string | null, currentId: string | null) => void;
  /** 交换成功回调函数 */
  onSwapEnd?: (id: string | null, currentId: string | null) => void;
  /** 拖拽到目标元素并且松开执行回调函数 */
  onDrop?: (data: Position) => void;
}

export interface MoveRect {
  width: number;
  height: number;
  el: Element;
  child?: Element | null;
  animate?: boolean;
}
export interface RectInfo {
  left: number;
  top: number;
  height: number;
  width: number;
}

export interface SwapDownValue {
  moveSite: MoveRect[];
  cloneDom: Element | null;
  left: number;
  top: number;
  current: Element;
  child: Element;
}

export type MoveRectList = MoveRect[];
