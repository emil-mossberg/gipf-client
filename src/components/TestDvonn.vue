<template>
  <h1>Dvonn</h1>
  <button @click="checkDvonnPath">Test DVONN ALGO</button>
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
  [1, 0, 2, 2, 1, 1, 1, 0, 1],
  [1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 3, 1, 1, 1, 1, 1]
]

// ---B W B W B B W B W
// -W B W B W B W B W B
// R W B W B R W B W B R
// -W B W B W B W B W B
// ---B W B W W B W B W


const board2 = [
  [2, 1, 2, 1, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
  [3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
  [2, 1, 2, 1, 1, 2, 1, 2, 1]
]

const currentPlayer = ref(1) // 1 White - 2 Black - 3 DVONN

// Decide if position is within board based on row and col
// row always have to be between 0 and 4 since 5 rows
// col depends on the row since the boards columns are 9 - 10 - 11 - 10 - 9 wide

const isPosWithinBoard = (rowPos: number, colPos: number) => {
  const colPosMax = rowPos < 3 ? rowPos + 8 : 12 - rowPos

  return rowPos >= 0 && rowPos <= 4 && colPos >= 0 && colPos <= colPosMax
}

// TO Do this function should be able to create empty to be set up manully or from matrix[] with just 0,1,2,3 in locations
const createBoard = () => {
  // TO DO pass ass argument instead in future

  return board2.map((row) => {
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

// Write good signature
// stackSize has to be atleast 1 and other has to be within bounds of field
const createPositions = (rowIndex: number, columnIndex: number, stackSize: number) => {
  // Calculate number of columns in row (9 - 10 - 11 - 10 - 9)
  const columnRowCount = rowIndex < 3 ? rowIndex + 8 : 12 - rowIndex
  const positions = []

  // Same row indexes - going right
  if (columnIndex + stackSize <= columnRowCount) positions.push([rowIndex, columnIndex + stackSize])

  // Same row indexes - going left
  if (columnIndex + -stackSize >= 0) positions.push([rowIndex, columnIndex - stackSize])

  const newRow = rowIndex + stackSize // Is this used all over
  let columnDown1

  switch (rowIndex) {
    case 0:
      columnDown1 = columnIndex + (stackSize <= 2 ? 0 : 2 - stackSize)
      break
    case 1:
      columnDown1 = columnIndex + (stackSize == 1 ? 0 : 1 - stackSize)
      break
    case 2:
      columnDown1 = columnIndex + (stackSize == 1 ? -1 : -2)
      break
    case 3:
      columnDown1 = columnIndex - 1
      break
  }

  if (isPosWithinBoard(newRow, columnDown1)) positions.push([newRow, columnDown1])

  let columnDown2
  switch (rowIndex) {
    case 0:
      columnDown2 = columnIndex + (stackSize <= 1 ? 1 : 2)
      break
    case 1:
      columnDown2 = columnIndex + 1
      break
    case 2:
    case 3:
      columnDown2 = columnIndex
      break
  }

  if (isPosWithinBoard(newRow, columnDown2)) positions.push([newRow, columnDown2])

  const newRowUp = rowIndex - stackSize
  let columnUp1

  switch (rowIndex) {
    case 1:
    case 2:
      columnUp1 = columnIndex - stackSize
      break
    case 3:
      columnUp1 = columnIndex - (stackSize == 1 ? 0 : stackSize - 1)
      break
    case 4:
      columnUp1 = columnIndex - (stackSize <= 2 ? 0 : stackSize - 2)
      break
  }

  if (isPosWithinBoard(newRowUp, columnUp1)) positions.push([newRowUp, columnUp1])

  let columnUp2

  switch (rowIndex) {
    case 1:
    case 2:
      columnUp2 = columnIndex
      break
    case 3:
      columnUp2 = columnIndex + 1
      break
    case 4:
      columnUp2 = columnIndex + (stackSize == 1 ? 1 : 2)
      break
  }

  if (isPosWithinBoard(newRowUp, columnUp2)) positions.push([newRowUp, columnUp2])
  return positions
}

const checkDvonnPath = () => {
  const dvonnPosition = []

  // Matrix to mark all connections
  const connected = newBoard.map((row, rowIndex) => {
    return row.map((pos, colIndex) => {
      if (pos.numberRed > 0) dvonnPosition.push([rowIndex, colIndex])
      return false
    })
  })

  const positionsToVisit = []

  for (let index = 0; index < dvonnPosition.length; index++) {
    connected[dvonnPosition[index][0]][dvonnPosition[index][1]] = true
    positionsToVisit.push([dvonnPosition[index][0], dvonnPosition[index][1]])
    // TO DO can I use set here? turn position into strinx #-#
  }

  let currentPosition
  while ((currentPosition = positionsToVisit.pop())) {
    connected[currentPosition[0]][currentPosition[1]] = true

    const positions = createPositions(currentPosition[0], currentPosition[1], 1)

    for (let index = 0; index < positions.length; index++) {
      if (
        !connected[positions[index][0]][positions[index][1]] &&
        newBoard[positions[index][0]][positions[index][1]].top !== 0
      ) {
        positionsToVisit.push(positions[index])
      }
    }
  }

  connected.forEach((row, rowIndex) => {
    row.forEach((column, colIndex) => {
      if (!column && !!newBoard[rowIndex][colIndex].top) {
        newBoard[rowIndex][colIndex].top = 0
        newBoard[rowIndex][colIndex].stackCount = 0
      }
    })
  })
}

const isPieceMovable = (board: Position[][], rowIndex: number, columnIndex: number): boolean => {
  // First - Check that is current players piece
  if (currentPlayer.value !== board[rowIndex][columnIndex].top) return false

  // If top or bottom row - always allowed to move pieace
  if (rowIndex === 0 || rowIndex === 4) return true

  const colPosMax = rowIndex < 3 ? rowIndex + 8 : 12 - rowIndex

  // If start or end column - always allowed to move pieace
  if (columnIndex == 0 || columnIndex === colPosMax) return true
  // Second - Move on to making sure piece has atleast 1 / 6 surrounding posotions not blocked by other peaces
  const positions = createPositions(rowIndex, columnIndex, 1)

  return !!positions.find((position) => newBoard[position[0]][position[1]].top === 0)
}

const numberClick = ref(0) // 0 - 1 - 2 // If you click
let legalMoves = [] // TO do type this to [number, number]
// TO do turn into a tuple of above data type
let lastRow: number
let lastColumn: number

// to do  work on this
const clickedLocation = (rowIndex: number, columnIndex: number) => {
  // If first click turn - increment numberClick - 1 and check
  // and if its an allowed peace
  if (numberClick.value == 0 && isPieceMovable(newBoard, rowIndex, columnIndex)) {
    lastRow = rowIndex
    lastColumn = columnIndex
    const stackCount = newBoard[rowIndex][columnIndex].stackCount

    legalMoves = createPositions(rowIndex, columnIndex, stackCount)

    numberClick.value = 1

    for (let index = 0; index < legalMoves.length; index++) {
      if (newBoard[legalMoves[index][0]][legalMoves[index][1]].top)
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

    for (let index = 0; index < legalMoves.length; index++) {
      newBoard[legalMoves[index][0]][legalMoves[index][1]].allowed = false
    }

    checkDvonnPath()
  } else if (numberClick.value === 1 && rowIndex == lastRow && columnIndex == lastColumn) {
    numberClick.value = 0
    for (let index = 0; index < legalMoves.length; index++) {
      newBoard[legalMoves[index][0]][legalMoves[index][1]].allowed = false
    }
  }
}
</script>

<style scoped>
.tempPos {
  font-size: 12px;
  position: absolute;
  top: -20px;
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
</style>
