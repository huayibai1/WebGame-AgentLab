'use client'

import { useMemo, useState } from 'react'
import { type AiDifficulty, chooseAiMove, gomokuInitialBoard } from '@/games/gomoku/ai'
import { boardSize, type Cell, getGameResult, type Winner } from '@/games/gomoku/engine'

type Snapshot = {
  board: Cell[]
  winner: Winner
  winningLine: number[]
  lastMove: number | null
}

function statusText(winner: Winner, isAiThinking: boolean) {
  if (winner === 1) return '你赢了。小宇需要重新校准棋感。'
  if (winner === 2) return '小宇赢了。它现在有点得意。'
  if (winner === 3) return '平局。棋盘已经填满。'
  if (isAiThinking) return '小宇正在落子...'
  return '轮到你。黑子先行，连成五子获胜。'
}

function turnLabel(winner: Winner, isAiThinking: boolean) {
  if (winner) return '对局结束'
  if (isAiThinking) return '小宇思考'
  return '玩家回合'
}

function difficultyLabel(difficulty: AiDifficulty) {
  return difficulty === 'easy' ? '简单' : '标准'
}

export function GomokuPrototype() {
  const [board, setBoard] = useState<Cell[]>(() => gomokuInitialBoard())
  const [winner, setWinner] = useState<Winner>(0)
  const [winningLine, setWinningLine] = useState<number[]>([])
  const [lastMove, setLastMove] = useState<number | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [difficulty, setDifficulty] = useState<AiDifficulty>('standard')
  const [history, setHistory] = useState<Snapshot[]>([])

  const moveCount = useMemo(() => board.filter(Boolean).length, [board])
  const winningCells = useMemo(() => new Set(winningLine), [winningLine])
  const canUndo = history.length > 0 && !isAiThinking

  function applyResult(nextBoard: Cell[], moveIndex: number) {
    const result = getGameResult(nextBoard, moveIndex)
    setWinner(result.winner)
    setWinningLine(result.winningLine)
    return result.winner
  }

  function currentSnapshot(): Snapshot {
    return {
      board: [...board],
      winner,
      winningLine: [...winningLine],
      lastMove
    }
  }

  function resetGame(nextDifficulty = difficulty) {
    setBoard(gomokuInitialBoard())
    setWinner(0)
    setWinningLine([])
    setLastMove(null)
    setIsAiThinking(false)
    setHistory([])
    setDifficulty(nextDifficulty)
  }

  function undoRound() {
    if (!canUndo) return

    const previous = history[history.length - 1]
    setBoard(previous.board)
    setWinner(previous.winner)
    setWinningLine(previous.winningLine)
    setLastMove(previous.lastMove)
    setHistory((current) => current.slice(0, -1))
    setIsAiThinking(false)
  }

  function changeDifficulty(nextDifficulty: AiDifficulty) {
    if (nextDifficulty === difficulty) return
    resetGame(nextDifficulty)
  }

  function handleCellClick(index: number) {
    if (board[index] || winner || isAiThinking) return

    const beforeRound = currentSnapshot()
    const playerBoard = [...board]
    playerBoard[index] = 1
    setBoard(playerBoard)
    setLastMove(index)
    setHistory((current) => [...current, beforeRound])

    const playerWinner = applyResult(playerBoard, index)
    if (playerWinner) return

    setIsAiThinking(true)

    window.setTimeout(() => {
      const aiIndex = chooseAiMove(playerBoard, difficulty)
      if (aiIndex === undefined) {
        setWinner(3)
        setWinningLine([])
        setIsAiThinking(false)
        return
      }

      const aiBoard = [...playerBoard]
      aiBoard[aiIndex] = 2
      setBoard(aiBoard)
      setLastMove(aiIndex)
      applyResult(aiBoard, aiIndex)
      setIsAiThinking(false)
    }, difficulty === 'easy' ? 180 : 280)
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid gap-6 border border-ink/10 bg-porcelain p-5 shadow-line lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-olive">playable prototype</p>
              <h2 className="mt-2 font-display text-3xl font-black text-ink">五子棋原型</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={undoRound}
                disabled={!canUndo}
                className="border border-ink/10 bg-paper px-3 py-2 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                悔棋一步
              </button>
              <button
                type="button"
                onClick={() => resetGame()}
                className="border border-ink/10 bg-paper px-3 py-2 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink"
              >
                重新开始
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 border border-ink/10 bg-paper p-2">
            <span className="px-2 font-mono text-[10px] uppercase text-graphite">difficulty</span>
            {(['easy', 'standard'] as AiDifficulty[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => changeDifficulty(mode)}
                className={
                  difficulty === mode
                    ? 'border border-olive/30 bg-moss px-3 py-2 font-mono text-xs text-olive'
                    : 'border border-ink/10 bg-porcelain px-3 py-2 font-mono text-xs text-graphite transition hover:border-olive/30 hover:text-ink'
                }
              >
                {difficultyLabel(mode)}
              </button>
            ))}
            <span className="ml-auto px-2 font-mono text-[10px] uppercase text-graphite">
              {difficulty === 'easy' ? '不强防守' : '优先攻防'}
            </span>
          </div>

          <div className="mx-auto grid aspect-square w-full max-w-[620px] grid-cols-[repeat(15,minmax(0,1fr))] border border-ink/20 bg-[#d8bc88] p-2 shadow-soft">
            {board.map((cell, index) => {
              const isWinningCell = winningCells.has(index)
              const isLastMove = lastMove === index

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`row ${Math.floor(index / boardSize) + 1}, column ${(index % boardSize) + 1}`}
                  onClick={() => handleCellClick(index)}
                  disabled={Boolean(cell || winner || isAiThinking)}
                  className={[
                    'relative aspect-square border border-ink/20 bg-transparent transition',
                    isWinningCell ? 'bg-moss/45 ring-1 ring-inset ring-olive/50' : '',
                    !cell && !winner && !isAiThinking ? 'hover:bg-porcelain/25' : ''
                  ].join(' ')}
                >
                  {cell !== 0 && (
                    <span
                      className={[
                        'absolute inset-[18%] rounded-full transition',
                        cell === 1
                          ? 'bg-ink shadow-[inset_0_2px_6px_rgb(255_255_255_/_18%)]'
                          : 'border border-ink/15 bg-porcelain shadow-[inset_0_-2px_5px_rgb(36_35_31_/_12%)]',
                        isWinningCell ? 'ring-2 ring-clay ring-offset-1 ring-offset-[#d8bc88]' : ''
                      ].join(' ')}
                    />
                  )}
                  {isLastMove && (
                    <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="border border-ink/10 bg-paper p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase text-olive">match status</p>
              <h3 className="mt-3 font-display text-2xl font-black leading-tight text-ink">{statusText(winner, isAiThinking)}</h3>
            </div>
            <span className="shrink-0 border border-ink/10 bg-porcelain px-2 py-1 font-mono text-[10px] uppercase text-graphite">
              {turnLabel(winner, isAiThinking)}
            </span>
          </div>

          {winner !== 0 && (
            <div className="mt-5 border border-olive/20 bg-moss/40 p-3">
              <p className="font-mono text-[10px] uppercase text-olive">result</p>
              <p className="mt-1 text-sm leading-6 text-graphite">
                {winner === 3 ? '没有玩家连成五子，本局以平局结束。' : `胜利连线已高亮，共 ${winningLine.length} 枚连续棋子。`}
              </p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="border border-ink/10 bg-porcelain p-3">
              <p className="font-mono text-[10px] uppercase text-graphite">black</p>
              <p className="mt-1 font-display text-xl font-black text-ink">玩家</p>
            </div>
            <div className="border border-ink/10 bg-porcelain p-3">
              <p className="font-mono text-[10px] uppercase text-graphite">white</p>
              <p className="mt-1 font-display text-xl font-black text-ink">小宇</p>
            </div>
            <div className="border border-ink/10 bg-porcelain p-3">
              <p className="font-mono text-[10px] uppercase text-graphite">moves</p>
              <p className="mt-1 font-display text-xl font-black text-olive">{moveCount}</p>
            </div>
            <div className="border border-ink/10 bg-porcelain p-3">
              <p className="font-mono text-[10px] uppercase text-graphite">difficulty</p>
              <p className="mt-1 font-display text-xl font-black text-olive">{difficultyLabel(difficulty)}</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-graphite">
            悔棋会撤回上一整轮，也就是你的上一手和小宇的回应。切换难度会重新开局，避免对局状态混杂。
          </p>
          <p className="mt-3 text-sm leading-6 text-graphite">
            标准难度会优先取胜和防守；简单难度更偏向自然落点，不会总是精准堵截。
          </p>
        </aside>
      </div>
    </section>
  )
}

