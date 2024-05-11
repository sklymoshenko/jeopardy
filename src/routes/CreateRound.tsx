import { Component, For, createSignal } from "solid-js"
import { ImBooks } from "solid-icons/im"
import { Round } from "../types"
import FaSolidGamepad from "../icons/Gamepad"
import FaSolidUsers from "../icons/UsersIcon"
import { useStore } from "../context/store"

const CreateRound: Component = () => {
  const [roundName, setRoundName] = createSignal<Round["name"]>("")
  const [store] = useStore()
  const [players, setPlayers] = createSignal<Round["players"]>(store.gameEvent.players)
  const [totalThemePoints, setTotalThemePoints] = createSignal([100, 200, 300, 400, 500])
  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center pt-28">
        Create Round
      </h1>
      <div class="flex flex-col md:w-[80%] mx-auto mt-10">
        <div class="mb-6">
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
              onInput={(e) => {
                setRoundName(e.target.value || "")
              }}
            />
          </div>
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
                  <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                    <input
                      type="checkbox"
                      id={`${player.name}_${i()}`}
                      value=""
                      class="hidden peer"
                      required
                      checked={!!players().find((p) => p.name === player.name)}
                      onChange={(e) => {
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
          <input
            type="text"
            id="theme-name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6"
            placeholder="Theme name like 'French kisses 101'"
            required
            value={roundName()}
            onInput={(e) => {
              setRoundName(e.target.value || "")
            }}
          />
          <p class="text-xs font-bold dark:text-white flex items-center mt-6 md:text-sm">
            <span class="">Themes poitns:</span>
          </p>
          <ol class="w-full space-y-2 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
            <For each={[100, 200, 300, 400, 500, 1000]}>
              {(themePoints, i) => {
                return (
                  <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                    <input
                      type="checkbox"
                      id={themePoints.toString()}
                      value=""
                      class="hidden peer"
                      required
                      checked={!!totalThemePoints().find((p) => p === themePoints)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTotalThemePoints((prev) => [...prev, themePoints])
                        } else {
                          setTotalThemePoints((prev) => prev.filter((p, j) => p !== themePoints))
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
            <span class="">Themes poitns:</span>
          </p>
          <ol class="w-full space-y-2 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
            <For each={[100, 200, 300, 400, 500, 1000]}>
              {(themePoints, i) => {
                return (
                  <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                    <input
                      type="checkbox"
                      id={themePoints.toString()}
                      value=""
                      class="hidden peer"
                      required
                      checked={!!totalThemePoints().find((p) => p === themePoints)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTotalThemePoints((prev) => [...prev, themePoints])
                        } else {
                          setTotalThemePoints((prev) => prev.filter((p, j) => p !== themePoints))
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
        </div>
      </div>
    </div>
  )
}

export default CreateRound
