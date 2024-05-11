import { createContext, ParentComponent, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { GameEvent } from "../types"

export type GameContextState = {
  readonly gameEvent: GameEvent
}
export type GameContextValue = [
  state: GameContextState,
  actions: {
    setGameEvent: (gameEvent: GameEvent) => void
  }
]

const defaultState = (): GameContextState => {
  return {
    gameEvent: {
      name: "Slay Quinz",
      players: [
        { name: "Gregor", points: 0 },
        { name: "Bithch", points: 2 },
        { name: "Mem", points: 2 },
        { name: "Sdasd asda", points: 2000 },
        { name: "SAdasd asd asda sda", points: -500 },
      ],
      id: 0,
    },
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
    debugger
    setState("gameEvent", gameEvent)
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
