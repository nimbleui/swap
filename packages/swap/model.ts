import { MoveEventCallbackParam } from "@nimble-ui/move";
import { SwapDownValue, SwapOptions } from "@nimble-ui/types";
import { getDOMRect, isFunctionOrValue, setStyle, swapRect } from "@nimble-ui/utils";
import { goBackAnimate, handleAnimate } from "./animate";
import { getActive } from "./active";

export function handleModel(data: MoveEventCallbackParam, options: SwapOptions) {
  const { value, binElement, endX, endY } = data;
  const { model = 'both', animation, onDrop, swapMode, dropTarget } = options;
  const { cloneDom } = (value.down || {}) as SwapDownValue;
  const el = isFunctionOrValue(dropTarget);
  const check = swapRect({x: endX, y: endY}, el)

  if (model == 'swap' || (!check && model == 'both')) {
    swapMode == 'drop' && handleAnimate(data, options);
    goBackAnimate(cloneDom, binElement!, animation);
  }

  if ((model == 'drag' || model == 'both') && check) {
    const { left, top } = getDOMRect(el!);
    onDrop?.({ x: endX - left, y: endY - top });
    const active = getActive(binElement!);
    active && setStyle(active.child, { opacity: '1' });
  }
}