import { GameEvent, Player, Question, Round, Theme } from "../types"

export type ApiCreateGameEvent = {
  gameInfo: Partial<GameEvent>
  players: Partial<Player>[]
}

export type ApiGetGameEvent = {
  gameInfo: GameEvent
  players: Player[]
}

export type ApiCreateGameRound = {
  roundInfo: Partial<Round>
  playerIds: Player["id"][]
  themes: Theme[]
  questions: Question[]
}

// export type ApiGetGameEvent = {
//   gameInfo: GameEvent
//   players: Player[]
// }
