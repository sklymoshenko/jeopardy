import { Component, For, Show, createEffect, createSignal } from "solid-js"
import SiNamecheap from "../icons/NameIcon"
import FaSolidUsers from "../icons/UsersIcon"
import IoPersonAdd from "../icons/UserAdd"
import IoPersonRemove from "../icons/UserRemove"
import FaSolidPlus from "../icons/Plus"
import FaSolidMinus from "../icons/Minus"

type Player = {
  name: string
  points: number
}

const CreateEvent: Component = () => {
  const [players, setPlayers] = createSignal<Player[]>([])
  const [newPlayer, setNewPlayer] = createSignal<Player>({ name: "", points: 0 })
  const [roundsCount, setRoundsCount] = createSignal(2)

  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center pt-28">
        Create The Game
      </h1>
      <form class="mt-6 flex flex-col md:w-[50%] mx-auto">
        <div class="mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <SiNamecheap />
            </div>
            <input
              type="text"
              id="game-name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Game Name like 'Slayyyyy Quins'"
              required
            />
          </div>
        </div>
        <div class="mb-6">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
            add users on by one
          </label>
          <div class="relative flex mb-6">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FaSolidUsers />
            </div>
            <input
              type="text"
              id="user-name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2"
              placeholder="User Name like 'Master Yoda'"
              required
              value={newPlayer().name}
              oninput={(e) => {
                setNewPlayer({ name: e.target.value, points: 0 })
              }}
            />
            <button
              type="button"
              class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
              onclick={() => {
                setPlayers((prev) => [...prev, newPlayer()])
                setNewPlayer({ name: "", points: 0 })
              }}
            >
              <IoPersonAdd class=" text-base" />
            </button>
          </div>
          <Show when={players().length > 0}>
            <div>
              <h2 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Players:</h2>
              <ol class="w-full space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
                <For each={players()}>
                  {(player, i) => {
                    return (
                      <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                        <span class="font-medium text-gray-900 dark:text-white">
                          {i() + 1}. {player.name}
                        </span>
                        <button
                          type="button"
                          class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                          onclick={() => {
                            setPlayers((prev) => prev.filter((p, j) => j != i()))
                          }}
                        >
                          <IoPersonRemove class="cursor-pointer text-base" />
                        </button>
                      </li>
                    )
                  }}
                </For>
              </ol>
            </div>
          </Show>
          <label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Rounds:
          </label>
          <div class="relative flex items-center max-w-[10rem]">
            <button
              type="button"
              id="decrement-button"
              data-input-counter-decrement="quantity-input"
              class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              onclick={() => {
                setRoundsCount((prev) => {
                  if (prev == 0) {
                    return prev
                  }

                  return --prev
                })
              }}
            >
              <FaSolidMinus />
            </button>
            <input
              type="number"
              id="quantity-input"
              data-input-counter
              aria-describedby="helper-text-explanation"
              class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="999"
              required
              min={0}
              max={999}
              value={roundsCount()}
              onchange={(e) => {
                if (roundsCount() >= 1000) {
                  setRoundsCount(1000)
                  return
                }

                setRoundsCount(e.target.valueAsNumber)
              }}
            />
            <button
              type="button"
              id="increment-button"
              data-input-counter-increment="quantity-input"
              class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              onclick={() => {
                setRoundsCount((prev) => ++prev)
              }}
            >
              <FaSolidPlus />
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Create Game
        </button>
      </form>
    </div>
  )
}

export default CreateEvent
