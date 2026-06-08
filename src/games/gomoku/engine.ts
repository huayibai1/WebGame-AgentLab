export type Cell = 0 | 1 | 2
export type Winner = Cell | 3

export type GameResult = {
  winner: Winner
  winningLine: number[]
}

export const boardSize = 15

const directions = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1]
] as const

export function createEmptyBoard() {
  return Array<Cell>(boardSize * boardSize).fill(0)
}

export function indexOf(row: number, col: number) {
  return row * boardSize + col
}

function inBounds(row: number, col: number) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize
}

export function countLine(board: Cell[], row: number, col: number, player: Cell, dx: number, dy: number) {
  let count = 1

  for (const sign of [-1, 1]) {
    let nextRow = row + dy * sign
    let nextCol = col + dx * sign

    while (inBounds(nextRow, nextCol) && board[indexOf(nextRow, nextCol)] === player) {
      count += 1
      nextRow += dy * sign
      nextCol += dx * sign
    }
  }

  return count
}

export function getWinningLine(board: Cell[], lastIndex: number) {
  const player = board[lastIndex]
  if (!player) return []

  const row = Math.floor(lastIndex / boardSize)
  const col = lastIndex % boardSize

  for (const [dx, dy] of directions) {
    const line = [lastIndex]

    for (const sign of [-1, 1]) {
      let nextRow = row + dy * sign
      let nextCol = col + dx * sign

      while (inBounds(nextRow, nextCol) && board[indexOf(nextRow, nextCol)] === player) {
        line.push(indexOf(nextRow, nextCol))
        nextRow += dy * sign
        nextCol += dx * sign
      }
    }

    if (line.length >= 5) {
      return line.sort((a, b) => a - b)
    }
  }

  return []
}

export function getGameResult(board: Cell[], lastIndex: number): GameResult {
  const player = board[lastIndex]
  if (!player) return { winner: 0, winningLine: [] }

  const winningLine = getWinningLine(board, lastIndex)
  if (winningLine.length > 0) return { winner: player, winningLine }
  if (board.every(Boolean)) return { winner: 3, winningLine: [] }
  return { winner: 0, winningLine: [] }
}

export function getWinner(board: Cell[], lastIndex: number): Winner {
  return getGameResult(board, lastIndex).winner
}

export function scoreMove(board: Cell[], index: number, player: Cell) {
  const row = Math.floor(index / boardSize)
  const col = index % boardSize

  return directions.reduce((score, [dx, dy]) => {
    const lineCount = countLine(board, row, col, player, dx, dy)
    return score + lineCount * lineCount
  }, 0)
}
