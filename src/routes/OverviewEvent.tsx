import { Component, For, Show, createSignal } from "solid-js"

import { useStore } from "../context/store"
import IoPersonRemove from "../icons/UserRemove"
import { useNavigate } from "@solidjs/router"
import FaSolidUsers from "../icons/UsersIcon"
import { RiSystemDeleteBin2Fill } from "solid-icons/ri"
import { Player, Round } from "../types"

const EmptyRounds: Component = () => {
  const navigate = useNavigate()

  return (
    <div class="flex flex-col text-center w-full h-50">
      <h6 class="text-lg font-bold dark:text-white">There are no rounds in this game so far.</h6>
      <p class="text-md text-gray-500 truncate dark:text-gray-400">You can fix it by creating a first one.</p>
      <button
        type="button"
        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-6"
        onclick={() => navigate("/create_round")}
      >
        Create Round
      </button>
    </div>
  )
}

const OverviewEvent: Component = () => {
  const [store] = useStore()
  const [selectedUser, setSelecteduser] = createSignal<Player>()
  const [selectedRound, setSelectedRound] = createSignal<Round>()

  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center xss:pt-5 md:pt-28">
        {store.gameEvent.name || "Unknown"}
      </h1>
      <div class="flex justify-between xss:flex-col md:flex-row md:w-[80%] mx-auto mt-10">
        <div class="flex flex-col justify-center md:w-[45%]">
          <h6 class="text-lg font-bold dark:text-white md:text-lg flex items-center">
            <FaSolidUsers />
            <span class="ml-2">Players:</span>
          </h6>
          <ol class="w-full space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
            <For each={store.gameEvent.players}>
              {(player, i) => {
                return (
                  <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                    <span
                      class="font-medium text-gray-900 dark:text-white flex items-center justify-between w-full text-base  dark:hover:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer p-2 rounded-md"
                      onclick={() => {
                        setSelecteduser(selectedUser() ? undefined : player)
                      }}
                    >
                      <span>
                        {i() + 1}. {player.name}
                      </span>
                      <p class="text-md text-gray-500 truncate dark:text-gray-400 mr-4">{player.points}</p>
                    </span>
                    <Show when={selectedUser()?.id == player.id}>
                      <button
                        type="button"
                        class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm xss:px-3 xss:py-1.5 md:px-4 md:py-2.5 text-center mb-2"
                      >
                        <IoPersonRemove class="cursor-pointer text-sm" />
                      </button>
                    </Show>
                  </li>
                )
              }}
            </For>
          </ol>
        </div>
        <div class="flex flex-col justify-center md:w-[45%] xss:mt-10 md:mt-0">
          <Show when={store.gameEvent.rounds && store.gameEvent.rounds?.length > 0} fallback={<EmptyRounds />}>
            <h6 class="text-lg font-bold dark:text-white md:text-lg">Rounds:</h6>
            <ol class="w-full space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
              <For each={store.gameEvent.rounds}>
                {(round, i) => {
                  return (
                    <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                      <span
                        class="font-medium text-gray-900 dark:text-white  dark:hover:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer p-2 rounded-md"
                        onclick={() => {
                          setSelectedRound(selectedUser() ? undefined : round)
                        }}
                      >
                        {round.name}
                      </span>
                      <Show when={selectedUser()?.id == round.id}>
                        <button
                          type="button"
                          class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm xss:px-3 xss:py-1.5 md:px-4 md:py-2.5 text-center mb-2"
                        >
                          <RiSystemDeleteBin2Fill />
                        </button>
                      </Show>
                    </li>
                  )
                }}
              </For>
            </ol>
          </Show>
        </div>
      </div>
    </div>
  )
}

export default OverviewEvent
