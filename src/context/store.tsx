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
        {
          name: "Gregor",
          points: 0,
          id: 1,
        },
        {
          name: "Bithch",
          points: 2,
          id: 12,
        },
        {
          name: "Mem",
          points: 2,
          id: 13,
        },
        {
          name: "Sdasd asda",
          points: 2000,
          id: 14,
        },
        {
          name: "SAdasd asd asda sda",
          points: -500,
          id: 15,
        },
      ],
      id: 0,
      rounds: [
        {
          isFinished: false,
          date: 1715703984460,
          id: 1715703984460,
          name: "asdasdasd",
          players: [
            {
              name: "Gregor",
              points: 0,
              id: 1,
            },
            {
              name: "Bithch",
              points: 2,
              id: 12,
            },
            {
              name: "Mem",
              points: 2,
              id: 13,
            },
            {
              name: "Sdasd asda",
              points: 2000,
              id: 14,
            },
            {
              name: "SAdasd asd asda sda",
              points: -500,
              id: 15,
            },
          ],
          themes: [
            {
              id: 1715703983930,
              name: "asdasdasd",
              questions: [
                {
                  id: 1,
                  question: "asd",
                  answer: "asd",
                  points: 100,
                },
                {
                  id: 2,
                  question: "asd",
                  answer: "asd",
                  points: 200,
                },
                {
                  id: 3,
                  question: "asd",
                  answer: "asd",
                  points: 300,
                },
                {
                  id: 4,
                  question: "asd",
                  answer: "asd",
                  points: 400,
                },
                {
                  id: 5,
                  question: "asd",
                  answer: "asd",
                  points: 500,
                },
              ],
            },
          ],
        },
        {
          isFinished: true,
          date: 1715703984461,
          id: 1715703984461,
          name: "asdasdasd",
          players: [
            {
              name: "Gregor",
              points: 0,
              id: 1,
            },
            {
              name: "Bithch",
              points: 2,
              id: 12,
            },
            {
              name: "Mem",
              points: 2,
              id: 13,
            },
            {
              name: "Sdasd asda",
              points: 2000,
              id: 14,
            },
            {
              name: "SAdasd asd asda sda",
              points: -500,
              id: 15,
            },
          ],
          themes: [
            {
              id: 1715703983930,
              name: "asdasdasd",
              questions: [
                {
                  id: 1,
                  question: "asd",
                  answer: "asd",
                  points: 100,
                },
                {
                  id: 2,
                  question: "asd",
                  answer: "asd",
                  points: 200,
                },
                {
                  id: 3,
                  question: "asd",
                  answer: "asd",
                  points: 300,
                },
                {
                  id: 4,
                  question: "asd",
                  answer: "asd",
                  points: 400,
                },
                {
                  id: 5,
                  question: "asd",
                  answer: "asd",
                  points: 500,
                },
              ],
            },
          ],
        },
      ],
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
    const players = [...gameEvent.players].sort((a, b) => b.points - a.points)
    const newEvent = { ...gameEvent, players }

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
