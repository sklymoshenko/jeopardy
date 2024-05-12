export type Player = {
  id: number
  name: string
  points: number
}

export type Question = {
  question: string
  answer: string
  points: number
}

export type Theme = {
  id: number
  name: string
  questions: Question[]
}

export type Round = {
  date: number
  name: string
  id: number
  players: Player[]
  themes: Theme[]
}

export type GameEvent = {
  id: number
  name: string
  players: Player[]
  rounds?: Round[]
}
