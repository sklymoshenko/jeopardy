import { GameEvent, Player } from "../types"

export type ApiGameEvent = {
  gameInfo: Partial<GameEvent>
  players: Partial<Player>[]
}
