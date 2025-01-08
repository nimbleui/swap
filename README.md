# nimble-ui move 封装鼠标事件

## 📢 介绍
nimble-ui move 封装鼠标事件 

## ⚡ 使用说明

### 安装依赖

```sh
npm i @nimble-ui/move
# or
yarn add @nimble-ui/move
# or
pnpm i @nimble-ui/move
```

### 使用
```html
<template>
  <div style="position: absolute;" ref="moveRef"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import move from '@nimble-ui/drag';

const moveRef = ref<HTMLElement>();
move(() => moveRef.value, {
  down({ target }, done) {
    const { offsetLeft, offsetTop } = target;

    done({left: offsetLeft, top: offsetTop})
  },
  move({ disX, disY, value }) {
    const {left, top} = value.down
    moveRef.value.style.top = `${top + disY}px`
    moveRef.value.style.left = `${left + disX}px`
  }
})

</script>
```
## move 参数
| 属性名  | 说明     | 类型                     | 默认 |
| ------- | -------- | ------------------------ | ---- |
| el      | 画布元素 | element \| () => element | -    |
| options | 参数     | MoveBaseOptions                   | -    |

### MoveBaseOptions属性
```ts
type MoveElType = Element | (() => Element | undefined | null);

interface MoveBaseOptions {
  boundary?: MoveElType | Window; // 拖拽的边界元素
  prevent?: boolean; // 阻止默认事件
  stop?: boolean; // 阻止事件冒泡
  scale?: number | (() => number | undefined); // 缩放比例
  expand?: number; // 边界元素扩大
}

interface MoveDataTypes {
  startX: number; // 按下鼠标x轴位置
  startY: number; // 按下鼠标y轴位置
  moveX: number; // 移动鼠标x轴位置
  moveY: number; // 移动鼠标y轴位置
  disX: number; // 鼠标移动x轴的距离
  disY: number; // 鼠标移动y轴的距离
  endX: number; // 鼠标抬起x轴的距离
  endY: number; // 鼠标抬起Y轴的距离
  isMove: boolean; // 是否移动
  target?: Element; // 当前移动的元素
  binElement?: Element; // 绑定的元素
}

type MoveMouseTouchEvent = MouseEvent | TouchEvent;
type MoveCallbackReturnValue = { down?: any; move?: any; up?: any };
type MoveEventCallbackParam = MoveDataTypes & { e: MoveMouseTouchEvent, value: MoveCallbackReturnValue }

interface MoveOptionsType extends MoveBaseOptions {
  down?: (data: MoveEventCallbackParam, setValue: (data: any) => void) => void;
  move?: (data: MoveEventCallbackParam, setValue: (data: any) => void) => void;
  up?: (data: MoveEventCallbackParam, setValue: (data: any) => void) => void;
  agencyTarget?: (el: Element) => Element | undefined | false | void; // 判断是否要代理
  changeTarget?: (el: Element) => Element; // 改变目标元素
  init?: (el: Element) => void; // 绑定按下事件时执行
}
```
