const MAX_ROW_POS = 4

export type Position = {
  top: number
  stackCount: number
  numberRed: 0 | 1 | 2 | 3
  allowed: boolean
}

export class DvonnGame {
  currentPlayer: number // TO DO should be 1 - 2
  playerStep: number // TO DO should 0 - 1
  board: Position[][]
  lastRow: null | number
  lastColumn: null | number
  currentLegalMoves: number[][]

  // Normal signature with defaults
  constructor(board: number[][]) {
    this.currentPlayer = 1
    this.playerStep = 0
    this.lastRow = null
    this.lastColumn = null
    this.currentLegalMoves = []
    this.board = this.createBoard(board)
    this.board[3][5].stackCount = 3 // TO DO For testing
    this.board[2][4].stackCount = 3 // TO DO For testing
  }

  /**
   * Set up board based on numbers matrix
   * TO DO fix default board also should this be private?
   *
   * @param board
   * @returns
   */
  createBoard(board: number[][]): Position[][] {
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

  /**
   * Check if position is within Dvonn Board
   *
   * @param rowIndex
   * @param columnIndex
   * @returns
   */
  isPosWithinBoard(rowIndex: number, columnIndex: number) {
    const colPosMax = rowIndex < 3 ? rowIndex + 8 : 12 - rowIndex

    return rowIndex >= 0 && rowIndex <= MAX_ROW_POS && columnIndex >= 0 && columnIndex <= colPosMax
  }

  /**
   * Create legal position surrounding given position based on stackSize
   *
   * @param rowIndex
   * @param columnIndex
   * @param stackSize
   * @returns
   */
  createPositions = (rowIndex: number, columnIndex: number, stackSize: number) => {
    // Calculate number of columns in row (9 - 10 - 11 - 10 - 9)
    const columnRowCount = rowIndex < MAX_ROW_POS - 1 ? rowIndex + 8 : 12 - rowIndex
    const positions = []

    // Same row indexes - going right
    if (columnIndex + stackSize <= columnRowCount)
      positions.push([rowIndex, columnIndex + stackSize])

    // Same row indexes - going left
    if (columnIndex + -stackSize >= 0) positions.push([rowIndex, columnIndex - stackSize])

    const newRow = rowIndex + stackSize // Is this used all over // TO DO remove this when done below

    // ADD comment where it is going
    // Using stackSize - 1 to be able to use first index in inner array
    // CAN IT NOT JUST BE ONE ARRAY ???? rowIndex + stackSize - 1 indexing into [0, 0, -1, -2] why does it not work on last row?

    const POS_MATRIX = [
      [[0, 0, -1, -2], [0, -1, -2], [-1, -2], [-1]],
      [[1, 1, 2, 2], [1, 1, 1], [0, 0], [0]],
      [[], [-1], [-1, -2], [0, -1, -2], [0, 0, -1, -2]],
      [[], [0], [0, 0], [1, 1, 1], [1, 2, 2, 2]]
    ]

    const STACK_SIZE_SIGN = [1, 1, -1, -1]

    for (let index = 0; index < POS_MATRIX.length; index++) {
      if (rowIndex < MAX_ROW_POS) {
        const newRow = rowIndex + STACK_SIZE_SIGN[index] * stackSize
        const columnPosition = columnIndex + POS_MATRIX[index][rowIndex][stackSize - 1]

        if (this.isPosWithinBoard(newRow, columnPosition)) positions.push([newRow, columnPosition])
      }
    }

    // if (rowIndex < MAX_ROW_POS) {
    //   const DOWN_BACK_MAP = [[0, 0, -1, -2], [0, -1, -2], [-1, -2], [-1]]
    //   const columnDown1 = columnIndex + DOWN_BACK_MAP[rowIndex][stackSize - 1]

    //   if (this.isPosWithinBoard(newRow, columnDown1)) positions.push([newRow, columnDown1])

    //   const DOWN_FORWARD_MAP = [[1, 1, 2, 2], [1, 1, 1], [0, 0], [0]]
    //   const columnDown2 = columnIndex + DOWN_FORWARD_MAP[rowIndex][stackSize - 1]

    //   if (this.isPosWithinBoard(newRow, columnDown2)) positions.push([newRow, columnDown2])

    //   const newRowUp = rowIndex - stackSize

    //   const UP_BACK_MAP = [[], [-1], [-1, -2], [0, -1, -2], [0, 0, -1, -2]]
    //   const columnUp1 = columnIndex + UP_BACK_MAP[rowIndex][stackSize - 1]

    //   if (this.isPosWithinBoard(newRowUp, columnUp1)) positions.push([newRowUp, columnUp1])

    //   const UP_FORWARD_MAP = [[], [0], [0, 0], [1, 1, 1], [1, 2, 2, 2]]
    //   const columnUp2 = columnIndex + UP_FORWARD_MAP[rowIndex][stackSize - 1]
    //   if (this.isPosWithinBoard(newRowUp, columnUp2)) positions.push([newRowUp, columnUp2])
    // }

    return positions
  }

  /**
   * Check if position is movable given game rules
   *
   * @param rowIndex
   * @param columnIndex
   * @returns
   */
  isPieceMovable(rowIndex: number, columnIndex: number): boolean {
    // First - Check that is current players piece
    if (this.currentPlayer !== this.board[rowIndex][columnIndex].top) return false

    // If top or bottom row - always allowed to move pieace
    if (rowIndex === 0 || rowIndex === 4) return true

    const colPosMax = rowIndex < 3 ? rowIndex + 8 : 12 - rowIndex

    // If start or end column - always allowed to move pieace
    if (columnIndex == 0 || columnIndex === colPosMax) return true
    // Second - Move on to making sure piece has atleast 1 / 6 surrounding posotions not blocked by other peaces
    const positions = this.createPositions(rowIndex, columnIndex, 1)

    // TO DO fix typing here
    return !!positions.find((position) => this.board[position[0]][position[1]].top === 0)
  }

  /**
   * Follow locations of DVONN pieces and remove any unconnected pieces
   * TO DO fix typing here also
   */
  checkDvonnPath() {
    const dvonnPosition = []

    // Matrix to mark all connections
    const connected = this.board.map((row, rowIndex) => {
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

      const positions = this.createPositions(currentPosition[0], currentPosition[1], 1)

      for (let index = 0; index < positions.length; index++) {
        if (
          !connected[positions[index][0]][positions[index][1]] &&
          this.board[positions[index][0]][positions[index][1]].top !== 0
        ) {
          positionsToVisit.push(positions[index])
        }
      }
    }

    connected.forEach((row, rowIndex) => {
      row.forEach((column, colIndex) => {
        if (!column && !!this.board[rowIndex][colIndex].top) {
          this.board[rowIndex][colIndex].top = 0
          this.board[rowIndex][colIndex].stackCount = 0
        }
      })
    })
  }

  clicked(rowIndex: number, columnIndex: number) {
    if (this.playerStep == 0 && this.isPieceMovable(rowIndex, columnIndex)) {
      this.lastColumn = columnIndex
      this.lastRow = rowIndex

      const stackCount = this.board[rowIndex][columnIndex].stackCount

      this.currentLegalMoves = this.createPositions(rowIndex, columnIndex, stackCount)

      console.log(this.currentLegalMoves)

      this.playerStep = 1

      for (let index = 0; index < this.currentLegalMoves.length; index++) {
        if (this.board[this.currentLegalMoves[index][0]][this.currentLegalMoves[index][1]].top)
          this.board[this.currentLegalMoves[index][0]][this.currentLegalMoves[index][1]].allowed =
            true
      }
    } else if (
      this.playerStep == 1 &&
      this.currentLegalMoves.find((pos) => pos[0] == rowIndex && pos[1] == columnIndex)
    ) {
      const stackCount = this.board[this.lastRow][this.lastColumn].stackCount
      const top = this.board[this.lastRow][this.lastColumn].top
      this.board[this.lastRow][this.lastColumn].top = 0
      this.board[this.lastRow][this.lastColumn].stackCount = 0
      this.board[rowIndex][columnIndex].stackCount += stackCount
      this.board[rowIndex][columnIndex].top = top

      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1

      this.playerStep = 0

      for (let index = 0; index < this.currentLegalMoves.length; index++) {
        this.board[this.currentLegalMoves[index][0]][this.currentLegalMoves[index][1]].allowed =
          false
      }

      this.checkDvonnPath()
    } else if (
      this.playerStep === 1 &&
      rowIndex == this.lastRow &&
      columnIndex == this.lastColumn
    ) {
      this.playerStep = 0
      for (let index = 0; index < this.currentLegalMoves.length; index++) {
        this.board[this.currentLegalMoves[index][0]][this.currentLegalMoves[index][1]].allowed =
          false
      }
    }
  }
}
