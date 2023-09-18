<template>
  <h1>Dvonn</h1>
  <div>CurrentPlayer {{ currentPlayer }}</div>
  <div class="board">
    <div class="board__row" v-for="(row, rowIndex) in board" :key="rowIndex">
      <span
        class="location"
        :class="{
          'location--black': true
        }"
        v-for="(location, columnIndex) in row"
        :key="columnIndex"
        @click="checkMove(rowIndex, columnIndex, location)"
        >{{ location }}
        <span class="tempPos">{{ `[${rowIndex},${columnIndex}]` }}</span>
      </span>
    </div>
  </div>
  <div class="board">
    <div class="board__rowTest" v-for="(row, rowIndex) in board" :key="rowIndex">
      <span
        class="location"
        :class="{
          'location--black': true
        }"
        v-for="(location, columnIndex) in row"
        :key="columnIndex"
        @click="checkMove(rowIndex, columnIndex, location)"
      >
        {{ location }}</span
      >
    </div>
  </div>
  <div>
    <div>0 - Empty</div>
    <div>1 - White</div>
    <div>2 - Black</div>
    <div>3 - Red</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// TO DO use enum?

const mapping = {
  0: 'EMPTY',
  1: 'WHITE',
  2: 'BLACK',
  3: 'RED'
}
const board = reactive([
  [0, 0, 2, 2, 1, 1, 1, 1, 1],
  [0, 1, 3, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
])

const currentPlayer = ref(1) // 1 White - 2 Black

export type Position = {
  top: number
  stackCount: number
  numberRed: 0 | 1 | 2 | 3
  allowed: boolean
}

export type PositionRow = Position[]

// TO DO Move to Type file
export type Board = PositionRow[]

const testBoard: Board = [
  [
    { top: 0, stackCount: 1, numberRed: 0, allowed: false },
    { top: 0, stackCount: 1, numberRed: 0, allowed: false }
  ],
  [
    { top: 0, stackCount: 1, numberRed: 0, allowed: false },
    { top: 0, stackCount: 1, numberRed: 0, allowed: false }
  ]
]

// return {
//         top: 0,
//         stackCounter: 0,
//         numberRed: 0,
//         allowed: false
//       }

// TO Do this function should be able to create empty to be set up manully or from matrix[] with just 0,1,2,3 in locations
const createBoard = () => {
  // TO DO pass ass argument instead in future

  const newBoard = board.map((row) => {
    return row.map((piece) => {
      const newPosition: Position = {
        top: piece,
        stackCount: 1,
        numberRed: 0,
        allowed: false
      }

      if (piece === 3) newPosition.numberRed = 1

      return newPosition
    })
  })

  console.log(newBoard)
  console.log('Creating board')
}

// Asign this to reactive
createBoard()

const createPositions = (rowIndex: number) => {
  const aboveRow = rowIndex === 2 || rowIndex === 1 ? -1 : 1
  const belowRow = rowIndex === 2 || rowIndex === 3 ? -1 : 1

  return [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
    [-1, aboveRow],
    [1, belowRow]
  ]
}

const checkCanMove = (board: [], rowIndex: number, columnIndex: number): boolean => {
  // First - Check that is current players piece
  if (currentPlayer.value !== board[rowIndex][columnIndex]) return false

  // Second - Move on to making sure piece has atleast 1 / 6 surrounding posotions not blocked by other peaces

  // All peaces on first and last row are always valid to move
  if (rowIndex === 0 || rowIndex === 4) return true

  // const aboveRow = rowIndex === 2 || rowIndex === 1 ? -1 : 1;
  // const belowRow = rowIndex === 2 || rowIndex === 3 ? -1 : 1;

  // 2 position are on same row before and after theese are same for all 3 middles rows
  // 2 pos above or below is the same
  // Last 2 are calculated from above
  // const positions = [[0, -1], [0, 1], [-1, 0], [1,0], [-1, aboveRow], [1, belowRow]];
  const positions = createPositions(rowIndex)

  let allowed = false

  for (let index = 0; index < positions.length; index++) {
    if (!board[rowIndex + positions[index][0]][columnIndex + positions[index][1]]) {
      allowed = true
      break
    }
  }

  return allowed
}

const checkMoveLocation = (board: [], rowIndex: number, columnIndex: number) => {
  const positions = createPositions(rowIndex)
  const legalMoves = []

  for (let index = 0; index < positions.length; index++) {
    if (
      rowIndex + positions[index][0] >= 0 &&
      columnIndex + positions[index][1] >= 0 &&
      board[rowIndex + positions[index][0]][columnIndex + positions[index][1]]
    ) {
      legalMoves.push([rowIndex + positions[index][0], columnIndex + positions[index][1]])
    }
  }

  return legalMoves
}

// TO DO also DO MOVE and and CALC REMOVING PIECES WITH DVONN

const checkMove = (rowIndex: number, columnIndex: number, location: number) => {
  if (checkCanMove(board, rowIndex, columnIndex)) {
    console.log('mark possible locations')
    // Check height of stack -- need to add this
    // use height to check all 6 locations around
    const legalMoves = checkMoveLocation(board, rowIndex, columnIndex)

    console.log(legalMoves)
  }

  // console.log(mapping[location]);
}
</script>

<style scoped>
.tempPos {
  font-size: 8px;
}

.board {
  min-width: 900px;
  margin-bottom: 40px;
}

.board__row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.location {
  display: inline-block;
  border: 1px solid black;
  /* background-color: brown; */
  margin: 6px;
  height: 60px;
  width: 60px;
  position: relative;
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
</style>
