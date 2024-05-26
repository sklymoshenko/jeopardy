import { createContext, ParentComponent, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { GameEvent } from "../types"

export type GameContextState = {
  readonly gameEvent?: GameEvent
}
export type GameContextValue = [
  state: GameContextState,
  actions: {
    setGameEvent: (gameEvent: GameEvent) => void
  }
]

const defaultState = (): GameContextState => {
  const gameEvent = localStorage.getItem("game") || undefined

  return {
    gameEvent: gameEvent ? JSON.parse(gameEvent) : undefined,
  }
}

const GameStateContext = createContext<GameContextValue>([
  defaultState(),
  {
    setGameEvent: (gameEvent: GameEvent) => undefined,
  },
])

export const GameStateContextProvider: ParentComponent<{
  gameEvent?: GameEvent
}> = (props) => {
  const { gameEvent } = defaultState()

  const [state, setState] = createStore({
    gameEvent: props.gameEvent ?? gameEvent,
  })

  const setGameEvent = (gameEvent: GameEvent) => {
    const players = [...gameEvent.players].sort((a, b) => b.points - a.points)
    const newEvent = { ...gameEvent, players }
    localStorage.setItem("game", JSON.stringify(newEvent))
    setState("gameEvent", newEvent)
  }

  return (
    <GameStateContext.Provider
      value={[
        state,
        {
          setGameEvent,
        },
      ]}
    >
      {props.children}
    </GameStateContext.Provider>
  )
}

export const useStore = () => useContext(GameStateContext)
