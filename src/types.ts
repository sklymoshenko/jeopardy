export type Player = {
  id: number
  name: string
  points: number
}

export type Question = {
  id: number
  themeId: Theme["id"]
  question: string
  answer: string
  points: number
  isAnswered?: boolean
}

export type Theme = {
  id: number
  name: string
  roundId: Round["id"]
  questions: Question[]
}

export type Round = {
  date: number
  name: string
  id: number
  players: Player[]
  themes: Theme[]
  isFinished?: boolean
  gameId: GameEvent["id"]
}

export type GameEvent = {
  id: number
  name: string
  players: Player[]
  rounds?: Round[]
}
