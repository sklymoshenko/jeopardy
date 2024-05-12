import { Component, For, Show, createEffect, createSignal } from "solid-js"
import { ImBooks } from "solid-icons/im"
import { Question, Round, Theme } from "../types"
import FaSolidGamepad from "../icons/Gamepad"
import FaSolidUsers from "../icons/UsersIcon"
import { RiSystemDeleteBin2Fill } from "solid-icons/ri"
import { useStore } from "../context/store"
import { useNavigate } from "@solidjs/router"
const defaultQa: Record<number, Question> = {
  100: { question: "", answer: "" } as Question,
  200: { question: "", answer: "" } as Question,
  300: { question: "", answer: "" } as Question,
  400: { question: "", answer: "" } as Question,
  500: { question: "", answer: "" } as Question,
}

const CreateRound: Component = () => {
  const [store, { setGameEvent }] = useStore()
  const navigate = useNavigate()
  const [roundName, setRoundName] = createSignal<Round["name"]>("")
  const [themeName, setThemeName] = createSignal<Theme["name"]>("")
  const [players, setPlayers] = createSignal<Round["players"]>(store.gameEvent.players)
  const [questionsAnswers, setQuestionAnswers] = createSignal<Record<number, Question>>(
    JSON.parse(JSON.stringify(defaultQa))
  )
  const [editingTheme, setEditingTheme] = createSignal<Theme>()
  const [themes, setThemes] = createSignal<Theme[]>([])

  const selectEditingTheme = (theme: Theme) => {
    setEditingTheme(theme)
    setQuestionAnswers(() => {
      return theme.questions.reduce<Record<number, Question>>((acc, curr) => {
        acc[curr.points] = curr
        return acc
      }, {})
    })

    setThemeName(theme.name)
  }
  const reset = () => {
    setThemeName("")
    setEditingTheme()
    setQuestionAnswers(JSON.parse(JSON.stringify(defaultQa)))
  }

  const mapQa = () => {
    return Object.keys(questionsAnswers()).map((points) => ({
      ...questionsAnswers()[+points],
      points: +points,
    }))
  }
  const saveTheme = () => {
    if (!editingTheme()) {
      setThemes((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: themeName(),
          questions: mapQa(),
        },
      ])

      reset()
    } else {
      const newTheme = editingTheme()!
      newTheme.questions = mapQa()

      const index = themes().findIndex((th) => th.id === newTheme.id)
      const newThemes = [...themes()]
      newThemes[index] = newTheme

      setThemes(newThemes)
      reset()
    }
  }

  const saveRound = () => {
    const rounds = [...(store.gameEvent.rounds || [])]
    const round: Round = { date: Date.now(), id: Date.now(), name: roundName(), players: players(), themes: themes() }
    rounds.push(round)

    setGameEvent({ ...store.gameEvent, rounds })
    navigate("/overview_event")

    reset()
    setRoundName("")
  }
  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center xss:pt-5 md:pt-28">
        Create Round
      </h1>
      <div class="flex flex-col md:w-[80%] xl:w-[40%] mx-auto mt-10 mb-6">
        <div class="mb-6">
          <form
            id="create-round"
            onsubmit={(e) => {
              e.preventDefault()
              saveRound()
            }}
          >
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <FaSolidGamepad />
              </div>
              <input
                type="text"
                id="round-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Round Name like 'Round 1'"
                required
                value={roundName()}
                onchange={(e) => {
                  setRoundName(e.target.value || "")
                }}
              />
            </div>
          </form>
        </div>
        <div class="mb-6">
          <h6 class="text-lg font-bold dark:text-white md:text-lg flex items-center">
            <FaSolidUsers />
            <span class="ml-2">Players:</span>
          </h6>
          <ol class="w-full space-y-2 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
            <For each={store.gameEvent.players}>
              {(player, i) => {
                return (
                  <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100 px-4">
                    <input
                      type="checkbox"
                      id={`${player.name}_${i()}`}
                      value=""
                      class="hidden peer"
                      checked={!!players().find((p) => p.name === player.name)}
                      onchange={(e) => {
                        if (e.target.checked) {
                          setPlayers((prev) => [...prev, player])
                        } else {
                          setPlayers((prev) => prev.filter((p, j) => p.name !== player.name))
                        }
                      }}
                    />
                    <label
                      for={`${player.name}_${i()}`}
                      class="items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <span class="font-medium text-gray-900 dark:text-white flex items-center justify-between w-full text-base">
                        {player.name}
                      </span>
                    </label>
                  </li>
                )
              }}
            </For>
          </ol>
        </div>
        <div class="mb-6">
          <h6 class="text-lg font-bold dark:text-white md:text-lg flex items-center">
            <ImBooks />
            <span class="ml-2">Themes:</span>
          </h6>
          <Show when={themes().length > 0}>
            <ol class="w-full space-y-2 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
              <For each={themes()}>
                {(theme, i) => {
                  return (
                    <li class="w-full flex items-center justify-between animate-fadeIn duration-100 px-4">
                      <span
                        class="font-medium text-gray-900 dark:text-white flex items-center justify-between w-full text-base dark:hover:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer p-2 rounded-md"
                        classList={{
                          "dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700": editingTheme()?.id == theme.id,
                        }}
                        onclick={() => {
                          if (!editingTheme()) {
                            selectEditingTheme(theme)
                          } else {
                            setEditingTheme()
                            reset()
                          }
                        }}
                      >
                        {i() + 1}. {theme.name}
                      </span>
                      <button
                        type="button"
                        class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm p-2 text-center ml-2"
                        onclick={() => {
                          setThemes((prev) => prev.filter((th) => th.id !== theme.id))
                          reset()
                        }}
                      >
                        <RiSystemDeleteBin2Fill />
                      </button>
                    </li>
                  )
                }}
              </For>
            </ol>
          </Show>
          <form
            id="qa-round"
            onsubmit={(e) => {
              e.preventDefault()
              saveTheme()
            }}
          >
            <input
              type="text"
              id="theme-name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6"
              placeholder="Theme name like 'French kisses 101'"
              required
              value={themeName()}
              onchange={(e) => {
                setThemeName(e.target.value || "")

                if (editingTheme()) {
                  setEditingTheme((prev) => ({ ...prev!, name: e.target.value || "" }))
                }
              }}
            />
            <p class="text-xs font-bold dark:text-white flex items-center mt-6 md:text-sm">
              <span class="">Themes poitns:</span>
            </p>
            <ol class="w-full space-y-2 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
              <For each={[100, 200, 300, 400, 500, 1000]}>
                {(themePoints, i) => {
                  return (
                    <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100 px-4">
                      <input
                        type="checkbox"
                        id={themePoints.toString()}
                        value=""
                        class="hidden peer"
                        checked={!!Object.keys(questionsAnswers()).find((p) => +p === themePoints)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQuestionAnswers((prev) => {
                              return { ...prev, [themePoints]: {} as Question }
                            })
                          } else {
                            const newQa = { ...questionsAnswers() }
                            delete newQa[themePoints]
                            setQuestionAnswers(newQa)
                          }
                        }}
                      />
                      <label
                        for={themePoints.toString()}
                        class="items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <span class="font-medium text-gray-900 dark:text-white flex items-center justify-between w-full text-base">
                          {themePoints.toString()}
                        </span>
                      </label>
                    </li>
                  )
                }}
              </For>
            </ol>
            <p class="text-xs font-bold dark:text-white flex items-center mt-6 md:text-sm">
              <span class="">QA:</span>
            </p>
            <ol class="w-full space-y-2 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
              <For each={Object.keys(questionsAnswers())}>
                {(theme, i) => {
                  return (
                    <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                      <div class="w-full px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                        <textarea
                          id={theme.toString()}
                          rows="2"
                          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:blur-0 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          classList={{ "blur-md": !!questionsAnswers()[+theme].question }}
                          placeholder={`Question for ${theme}`}
                          required
                          value={questionsAnswers()[+theme].question || ""}
                          onChange={(e) => {
                            const newQa = { ...questionsAnswers() }
                            newQa[+theme].question = e.target.value || ""
                            setQuestionAnswers(newQa)
                          }}
                        />
                        <textarea
                          id={theme.toString() + "_" + "answer"}
                          rows="1"
                          class="mt-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:blur-0 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          classList={{ "blur-md": !!questionsAnswers()[+theme].answer }}
                          placeholder={`Answer for ${theme}`}
                          required
                          value={questionsAnswers()[+theme].answer || ""}
                          onChange={(e) => {
                            const newQa = { ...questionsAnswers() }
                            newQa[+theme].answer = e.target.value || ""
                            setQuestionAnswers(newQa)
                          }}
                        />
                      </div>
                    </li>
                  )
                }}
              </For>
            </ol>
          </form>
        </div>
        <div class="flex flex-col items-end justify-between">
          <button
            type="submit"
            form="qa-round"
            class="xss:w-full md:w-1/2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5"
          >
            {!editingTheme() ? "Add Theme" : "Save Theme"}
          </button>
          <button
            type="submit"
            form="create-round"
            class="xss:w-full md:w-1/3 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
          >
            Save Round
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateRound
