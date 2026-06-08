import { describe, expect, it } from 'vitest'
import { chooseAiMove } from './ai'
import { type Cell, createEmptyBoard, indexOf } from './engine'

function boardWith(stones: Array<[number, number, Cell]>) {
  const board = createEmptyBoard()
  for (const [row, col, player] of stones) {
    board[indexOf(row, col)] = player
  }
  return board
}

describe('gomoku AI', () => {
  it('opens in the center on an empty board', () => {
    expect(chooseAiMove(createEmptyBoard(), 'standard')).toBe(indexOf(7, 7))
  })

  it('standard difficulty wins immediately when possible', () => {
    const board = boardWith([
      [7, 3, 2],
      [7, 4, 2],
      [7, 5, 2],
      [7, 6, 2],
      [8, 8, 1]
    ])

    expect(chooseAiMove(board, 'standard')).toBe(indexOf(7, 2))
  })

  it('standard difficulty blocks an immediate player win', () => {
    const board = boardWith([
      [6, 4, 1],
      [6, 5, 1],
      [6, 6, 1],
      [6, 7, 1],
      [8, 8, 2]
    ])

    expect(chooseAiMove(board, 'standard')).toBe(indexOf(6, 3))
  })

  it('easy difficulty returns a legal empty position', () => {
    const board = boardWith([
      [7, 7, 1],
      [7, 8, 2],
      [8, 8, 1]
    ])

    const move = chooseAiMove(board, 'easy')

    expect(move).toBeTypeOf('number')
    expect(board[move as number]).toBe(0)
  })
})
