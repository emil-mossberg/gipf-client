<template>
  <h1>Dvonn</h1>
  <div>CurrentPlayer {{ currentPlayer }}</div>
  <div class="board">
    <div class="board__row" v-for="(row, rowIndex) in newBoard" :key="rowIndex">
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
        @click="clickedLocation(rowIndex, columnIndex)"
        ><span class="stackCount">{{ location.stackCount }}</span>
        <span class="tempPos">{{ `[${rowIndex},${columnIndex}]` }}</span>
      </span>
    </div>
  </div>
  <div class="board">
    <div class="board__rowTest" v-for="(row, rowIndex) in newBoard" :key="rowIndex">
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
        @click="checkMove(rowIndex, columnIndex)"
      >
        {{ location.stackCount }}</span
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

export type Position = {
  top: number
  stackCount: number
  numberRed: 0 | 1 | 2 | 3
  allowed: boolean
}

// BOARD to use
const board = [
  [1, 1, 2, 2, 1, 1, 1, 1, 1],
  [0, 1, 3, 0, 0, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 3, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 3, 1, 1, 1, 1, 1]
]

const currentPlayer = ref(1) // 1 White - 2 Black - 3 DVONN

// TO Do this function should be able to create empty to be set up manully or from matrix[] with just 0,1,2,3 in locations
const createBoard = () => {
  // TO DO pass ass argument instead in future

  return board.map((row) => {
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
}

const newBoard: Position[][] = reactive(createBoard())

// TO do add stack factor - visualize it
const createPositions = (rowIndex: number) => {
  const aboveRow = rowIndex === 2 || rowIndex === 1 ? -1 : 1
  const belowRow = rowIndex === 2 || rowIndex === 3 ? -1 : 1

  return [
    [0, -1], // Simple inc stack factor
    [0, 1], // Simple desc stack facktor
    [-1, 0], // 1 - 0 2 - 1 etc, figure out math  
    [1, 0], 
    [-1, aboveRow],
    [1, belowRow]
  ]
}

const isPieceMovable = (board: Position[][], rowIndex: number, columnIndex: number): boolean => {
  // First - Check that is current players piece
  if (currentPlayer.value !== board[rowIndex][columnIndex].top) return false

  // Second - Move on to making sure piece has atleast 1 / 6 surrounding posotions not blocked by other peaces

  // All peaces on first and last row are always valid to move
  if (rowIndex === 0 || rowIndex === 4) return true

  // 2 position are on same row before and after theese are same for all 3 middles rows
  // 2 pos above or below is the same
  // Last 2 are calculated from above
  // const positions = [[0, -1], [0, 1], [-1, 0], [1,0], [-1, aboveRow], [1, belowRow]];
  const positions = createPositions(rowIndex)

  let allowed = false

  // It is allowed to move if any space is 0 (meaning false)
  for (let index = 0; index < positions.length; index++) {
    const rowPos = rowIndex + positions[index][0]
    const colPos = columnIndex + positions[index][1]
    const withinBoard = isPosWithinBoard(rowPos, colPos)

    // pieace is allowed to move if it there is one empty space adjacent
    // OR if its an edge peace - meaning that one bordering position is outside board
    if ((withinBoard && !newBoard[rowPos][colPos].top) || !withinBoard) {
      allowed = true
      break
    }
  }

  return allowed
}

const numberClick = ref(0) // 0 - 1 - 2 // If you click
let legalMoves = [] // TO do type this to [number, number]
// TO do turn into a tuple of above data type
let lastRow: number
let lastColumn: number

// to do  work on this
const clickedLocation = (rowIndex: number, columnIndex: number) => {
  console.log('clicked location', `${rowIndex}${columnIndex}`)
  // If first click turn - increment numberClick - 1 and check
  // and if its an allowed peace
  if (numberClick.value == 0 && isPieceMovable(newBoard, rowIndex, columnIndex)) {
    lastRow = rowIndex
    lastColumn = columnIndex
    legalMoves = createLegalMoves(newBoard, rowIndex, columnIndex)

    numberClick.value = 1

    for (let index = 0; index < legalMoves.length; index++) {
      newBoard[legalMoves[index][0]][legalMoves[index][1]].allowed = true
    }
  } else if (
    numberClick.value == 1 &&
    legalMoves.find((pos) => pos[0] == rowIndex && pos[1] == columnIndex)
  ) {
    const stackCount = newBoard[lastRow][lastColumn].stackCount
    const top = newBoard[lastRow][lastColumn].top
    newBoard[lastRow][lastColumn].top = 0
    newBoard[lastRow][lastColumn].stackCount = 0
    newBoard[rowIndex][columnIndex].stackCount += stackCount
    newBoard[rowIndex][columnIndex].top = top

    currentPlayer.value = currentPlayer.value === 1 ? 2 : 1

    numberClick.value = 0
    // TO do run DVONN check algorithm

    for (let index = 0; index < legalMoves.length; index++) {
      newBoard[legalMoves[index][0]][legalMoves[index][1]].allowed = false
    }
  } else if (numberClick.value === 1 && rowIndex == lastRow && columnIndex == lastColumn) {
    numberClick.value = 0
    for (let index = 0; index < legalMoves.length; index++) {
      newBoard[legalMoves[index][0]][legalMoves[index][1]].allowed = false
    }
  }
}

// Decide if position is within board based on row and col
// row always have to be between 0 and 4 since 5 rows
// col depends on the row since the boards columns are 9 - 10 - 11 - 10 - 9 wide

const isPosWithinBoard = (rowPos: number, colPos: number) => {
  const colPosMax = rowPos < 3 ? rowPos + 8 : 12 - rowPos

  return rowPos >= 0 && rowPos <= 4 && colPos >= 0 && colPos <= colPosMax
}

const createLegalMoves = (board: Position[][], rowIndex: number, columnIndex: number) => {
  const positions = createPositions(rowIndex)
  const legalMoves = []

  for (let index = 0; index < positions.length; index++) {
    const rowPos = rowIndex + positions[index][0]
    const colPos = columnIndex + positions[index][1]

    // Check that position is within board and that it has a legal pieace ( 1 - 2 - 3)

    if (isPosWithinBoard(rowPos, colPos) && newBoard[rowPos][colPos].top) {
      legalMoves.push([rowIndex + positions[index][0], columnIndex + positions[index][1]])
    }
  }

  return legalMoves
}

// TO DO also DO MOVE and and CALC REMOVING PIECES WITH DVONN

// let lastRow: null | number = null
// let lastColumn: null | number = null
// let legalMoves = []

const checkMove = (rowIndex: number, columnIndex: number) => {
  if (lastRow == rowIndex && lastColumn == columnIndex) {
    console.log('clicked same pieace twice!')
    lastRow = lastColumn = null
  }

  lastRow = rowIndex
  lastColumn = columnIndex

  if (isPieceMovable(newBoard, rowIndex, columnIndex)) {
    // Check height of stack -- need to add this
    // use height to check all 6 locations around
    legalMoves = createLegalMoves(newBoard, rowIndex, columnIndex)

    for (let index = 0; index < legalMoves.length; index++) {
      newBoard[legalMoves[index][0]][legalMoves[index][1]].allowed = true
    }
  }
}
</script>

<style scoped>
.tempPos {
  font-size: 8px;
  position: absolute;
  top: -14px;
  right: 20px;
}

.stackCount {
  position: absolute;
  top: -4px;
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
  background-color: #c4a484;
  margin: 8px;
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
