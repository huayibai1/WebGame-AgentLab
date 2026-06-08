import { type Cell, createEmptyBoard, getWinner, indexOf, scoreMove } from './engine'

export type AiDifficulty = 'easy' | 'standard'

function emptyIndexes(board: Cell[]) {
  return board.map((cell, index) => (cell === 0 ? index : -1)).filter((index) => index >= 0)
}

function distanceFromCenter(index: number) {
  const row = Math.floor(index / 15)
  const col = index % 15
  return Math.abs(row - 7) + Math.abs(col - 7)
}

function chooseEasyMove(board: Cell[]) {
  const candidates = emptyIndexes(board)
  const occupied = board.some(Boolean)

  if (!occupied) return indexOf(7, 7)

  return candidates
    .map((index) => ({
      index,
      score: scoreMove([...board.slice(0, index), 2, ...board.slice(index + 1)], index, 2) - distanceFromCenter(index) * 0.15
    }))
    .sort((a, b) => b.score - a.score)[0]?.index
}

function chooseStandardMove(board: Cell[]) {
  const candidates = emptyIndexes(board)
  const occupied = board.some(Boolean)

  if (!occupied) return indexOf(7, 7)

  for (const index of candidates) {
    const testBoard = [...board]
    testBoard[index] = 2
    if (getWinner(testBoard, index) === 2) return index
  }

  for (const index of candidates) {
    const testBoard = [...board]
    testBoard[index] = 1
    if (getWinner(testBoard, index) === 1) return index
  }

  return candidates
    .map((index) => {
      const testBoard = [...board]
      testBoard[index] = 2
      return {
        index,
        score: scoreMove(testBoard, index, 2) + scoreMove(testBoard, index, 1) * 0.8 - distanceFromCenter(index) * 0.05
      }
    })
    .sort((a, b) => b.score - a.score)[0]?.index
}

export function chooseAiMove(board: Cell[], difficulty: AiDifficulty = 'standard') {
  if (difficulty === 'easy') return chooseEasyMove(board)
  return chooseStandardMove(board)
}

export const gomokuInitialBoard = createEmptyBoard

