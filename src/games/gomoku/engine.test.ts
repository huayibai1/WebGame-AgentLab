import { describe, expect, it } from 'vitest'
import { boardSize, type Cell, createEmptyBoard, getGameResult, indexOf } from './engine'

function boardWith(stones: Array<[number, number, Cell]>) {
  const board = createEmptyBoard()
  for (const [row, col, player] of stones) {
    board[indexOf(row, col)] = player
  }
  return board
}

describe('gomoku engine', () => {
  it('detects a horizontal five-in-a-row', () => {
    const board = boardWith([
      [7, 3, 1],
      [7, 4, 1],
      [7, 5, 1],
      [7, 6, 1],
      [7, 7, 1]
    ])

    const result = getGameResult(board, indexOf(7, 7))

    expect(result.winner).toBe(1)
    expect(result.winningLine).toEqual([3, 4, 5, 6, 7].map((col) => indexOf(7, col)))
  })

  it('detects a vertical five-in-a-row', () => {
    const board = boardWith([
      [2, 8, 2],
      [3, 8, 2],
      [4, 8, 2],
      [5, 8, 2],
      [6, 8, 2]
    ])

    const result = getGameResult(board, indexOf(6, 8))

    expect(result.winner).toBe(2)
    expect(result.winningLine).toEqual([2, 3, 4, 5, 6].map((row) => indexOf(row, 8)))
  })

  it('detects a descending diagonal five-in-a-row', () => {
    const board = boardWith([
      [3, 3, 1],
      [4, 4, 1],
      [5, 5, 1],
      [6, 6, 1],
      [7, 7, 1]
    ])

    const result = getGameResult(board, indexOf(7, 7))

    expect(result.winner).toBe(1)
    expect(result.winningLine).toEqual([3, 4, 5, 6, 7].map((row) => indexOf(row, row)))
  })

  it('detects an ascending diagonal five-in-a-row', () => {
    const board = boardWith([
      [7, 3, 2],
      [6, 4, 2],
      [5, 5, 2],
      [4, 6, 2],
      [3, 7, 2]
    ])

    const result = getGameResult(board, indexOf(3, 7))

    expect(result.winner).toBe(2)
    expect(result.winningLine).toEqual([
      indexOf(3, 7),
      indexOf(4, 6),
      indexOf(5, 5),
      indexOf(6, 4),
      indexOf(7, 3)
    ].sort((a, b) => a - b))
  })

  it('returns no winner and no line before the game is decided', () => {
    const board = boardWith([
      [7, 7, 1],
      [7, 8, 1],
      [7, 9, 1],
      [8, 7, 2]
    ])

    const result = getGameResult(board, indexOf(7, 9))

    expect(result.winner).toBe(0)
    expect(result.winningLine).toEqual([])
  })

  it('detects a full-board draw without a winning line', () => {
    const board = createEmptyBoard()

    for (let row = 0; row < boardSize; row += 1) {
      for (let col = 0; col < boardSize; col += 1) {
        board[indexOf(row, col)] = ((row * 2 + col) % 5) < 2 ? 1 : 2
      }
    }

    const result = getGameResult(board, indexOf(boardSize - 1, boardSize - 1))

    expect(result.winner).toBe(3)
    expect(result.winningLine).toEqual([])
  })
})
