<template>
  <button @click="showIndex = !showIndex">ToggleIndex</button>
  <div class="board">
    <div class="board__row" v-for="(row, rowIndex) in game.board" :key="rowIndex">
      <span
        class="location"
        :class="{
          'location--white': location.top === 1,
          'location--black': location.top === 2,
          'location--red': location.top === 3,
          'location--allowed': location.allowed
        }"
        v-for="(location, columnIndex) in row"
        :key="columnIndex"
        @click="game.clicked(rowIndex, columnIndex)"
      >
        <span class="tempPos" v-if="showIndex">{{ `[${rowIndex},${columnIndex}]` }}</span>
        <span>{{ location.stackCount }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { DvonnGame } from '../games/DvonnGame'
import { board2 } from '../data/dvonnStates'

const game = reactive(new DvonnGame(board2))

const showIndex = ref(true)
</script>

<style>
.tempPos {
  font-size: 12px;
  position: absolute;
  top: -60px;
  right: 20px;
}

.stackCount {
  position: absolute;
  top: -4px;
}

.board {
  min-width: 900px;
  /* background-color: #c4a484; */
}

.box {
  width: 200px;
  aspect-ratio: 1;
  clip-path: polygon(
    93.56% 74.55%,
    50.52% 100%,
    6.96% 75.45%,
    6.44% 25.45%,
    49.48% 0%,
    93.04% 24.55%
  );
}

.board__row {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
}

.board__topLine {
  position: absolute;
  border-top: 2px solid black;
  width: 540px;
  top: 36px;
  position: absolute;
}

.location {
  display: inline-block;
  border: 1px solid black;
  background-color: #c4a484;
  margin: 12px;
  height: 60px;
  width: 60px;
  position: relative;
}

.location--black:before {
  content: '';
  height: 50px;
  width: 50px;
  background-color: black;
  position: absolute;
  left: 4px;
  top: 4px;
  border-radius: 50%;
}

.location--white:before {
  content: '';
  height: 50px;
  width: 50px;
  background-color: white;
  position: absolute;
  left: 4px;
  top: 4px;
  border-radius: 50%;
}

.location--red:before {
  content: '';
  height: 50px;
  width: 50px;
  background-color: #aa4a44;
  position: absolute;
  left: 4px;
  top: 4px;
  border-radius: 50%;
}

.location--allowed {
  outline: 2px solid green;
  outline-offset: 2px;
}

.location--testing {
  outline: 4px solid rebeccapurple;
  outline-offset: 2px;
}

/* .location:before, */
/* .location:after {
  background-color: brown;
  content: "";
  border: inherit;
  height: 60px;
  width: 60px;
  display: inline-block;
  position: absolute;
  transform: rotate(60deg);
  left: 0;
}


.location:before {
  background-color: brown;
  content: "";
  border: inherit;
  height: 60px;
  width: 60px;
  display: inline-block;
  position: absolute;
  transform: rotate(-60deg);
  left: 0;
} */

/* .location:after {
  
} */

.triangle {
  fill: brown;
  stroke: #201e1a;
  stroke-width: 2;
}

.hex {
  position: relative;
  float: left;
  height: 100px;
  min-width: 100px;
  padding: 12px;
  margin: 4px;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(to right, rgb(199, 41, 41), rgb(243, 67, 54));
  -webkit-clip-path: polygon(
    25px 0px,
    calc(100% - 25px) 0px,
    100% 50%,
    calc(100% - 25px) 100%,
    25px 100%,
    0px 50%
  );
}
.hex.gradient-bg {
  color: white;
}
.hex.gradient-border {
  color: rgb(199, 41, 41);
}
.hex:before {
  position: absolute;
  content: '';
  height: calc(100% - 14px); /* 100% - 2 * border width */
  width: calc(100% - 14px); /* 100% - 2 * border width */
  left: 7px; /* border width */
  top: 7px; /* border width */
  -webkit-clip-path: polygon(
    22px 0px,
    calc(100% - 22px) 0px,
    100% 50%,
    calc(100% - 22px) 100%,
    22px 100%,
    0px 50%
  );
  z-index: -1;
}
.hex.gradient-bg:before {
  background: linear-gradient(to right, rgb(199, 41, 41), rgb(243, 67, 54));
}
.hex.gradient-border:before {
  background: rgb(245, 246, 248);
}
span {
  display: block;
  margin-top: 50px;
  padding: 8px;
  transform: translateY(-50%);
}
</style>
