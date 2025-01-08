<template>
  <div ref="warpRef" class="warp">
    <div
      v-for="item in list"
      :key="item.id"
      data-swap-type="move"
      :data-swap-id="item.id"
      class="move"
      :style="{ top: `${item.top}px` }"
    >
      <div class="content">{{ item.title }}</div>

      <img src="http://gips2.baidu.com/it/u=195724436,3554684702&fm=3028&app=3028&f=JPEG&fmt=auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { swap } from "@nimble-ui/swap";
defineOptions({ name: 'move' });

const list = reactive([
  { id: 1, title: '测试1', top: 0 },
  { id: 2, title: '测试2', top: 60 },
  { id: 3, title: '测试3', top: 120 },
  { id: 4, title: '测试3', top: 180 },
]);
const warpRef = ref<HTMLElement>();
const getEl = () => warpRef.value!;
swap(getEl, {
  model: "swap"
})
</script>

<style  lang="scss" scoped>
.warp {
  width: 200px;
  position: relative;
  transform: scale(1);
  transform-origin: left top;

  .move {
    position: absolute;
    width: 180px;
    height: 50px;
    background-color: red;

    .content {
      position: absolute;
      z-index: 333;
    }

    img {
      width: 180px;
      height: 50px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
