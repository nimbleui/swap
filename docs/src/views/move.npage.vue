<template>
  <div ref="warpRef" class="warp">
    <div
      v-for="item in list"
      :key="item.id"
      :data-swap-id="item.id"
      class="move"
      :style="{ top: `${item.top}px` }"
      :data-swap-slot="item.id"
    >
    <div class="item" :data-swap-item="item.id">
      <div class="content">{{ item.title }}</div>
      <img crossorigin="anonymous" src="http://gips2.baidu.com/it/u=195724436,3554684702&fm=3028&app=3028&f=JPEG&fmt=auto" />
    </div>
  </div>
  </div>

  <div ref="containerRef" class="container">
    <div class="top" data-swap-slot="A">
      <div class="top-item" data-swap-item="A">A</div>
    </div>
    <div class="middle">
      <div data-swap-slot="B" class="left">
        <div class="left-item" data-swap-item="B">B</div>
      </div>
      <div data-swap-slot="C" class="right">
        <div class="right-item" data-swap-item="C">B</div>
      </div>
    </div>
    <div data-swap-slot="D" class="bottom">
      <div class="bottom-item" data-swap-item="D">D</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { swap } from "@nimble-ui/swap";
defineOptions({ name: 'move' });

const list = reactive([
  { id: 1, title: '测试1', top: 0 },
  { id: 2, title: '测试2', top: 100 },
  { id: 3, title: '测试3', top: 200 },
  { id: 4, title: '测试4', top: 300 },
]);
const warpRef = ref<HTMLElement>();
const getEl = () => warpRef.value!;
swap(getEl, {
  model: "swap",
  // dragAxis: "x",
  swapMode: 'hover'
})

const containerRef = ref<HTMLElement>()
swap(() => containerRef.value, {
  model: "swap",
  // dragAxis: "x",
  swapMode: 'drop'
})
</script>

<style  lang="scss" scoped>
.warp {
  width: 200px;
  position: relative;
  height: 400px;
  transform: scale(1);
  transform-origin: left top;

  .move {
    position: absolute;
    width: 180px;
    height: 50px;
    background-color: #e9e9e9;
    border-radius: 5px;

    .item {
      border-radius: 5px;
      overflow: hidden;
      .content {
        position: absolute;
        z-index: 333;
      }

      img {
        width: 180px;
        height: 50px;
        display: block;
      }
    }
  }
}

.container {
  margin: auto;
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 500px;
  .top {
    height: 120px;
    border-radius: 10px;
  }
  .top-item {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    background-color: #10b981;
  }
  .middle {
    height: 100px;
    display: flex;
    gap: 10px;

    .left {
      border-radius: 10px;
      flex: 1;
    }
    .right {
      border-radius: 10px;
      flex: 2;
    }
  }
  .left-item {
    border-radius: 10px;
    height: 100%;
    width: 100%;
    background-color: #be123c;
  }
  .right-item {
    border-radius: 10px;
    height: 100%;
    width: 100%;
    background-color: #4338ca;
  }
  .bottom {
    height: 130px;
    border-radius: 10px;
  }
  .bottom-item {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    background-color: #7e22ce;
  }
}
</style>
