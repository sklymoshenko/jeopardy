import { Component, For, Show, createSignal } from "solid-js"

import { useStore } from "../context/store"
import IoPersonRemove from "../icons/UserRemove"
import { useNavigate } from "@solidjs/router"
import { FaSolidUsers } from "solid-icons/fa"
import { RiSystemDeleteBin2Fill } from "solid-icons/ri"
import { Player, Round } from "../types"
import { DateTime } from "luxon"
import { SiApachespark } from "solid-icons/si"
import { TbConfetti } from "solid-icons/tb"
import { AiFillEdit } from "solid-icons/ai"
import { FaSolidPlay } from "solid-icons/fa"

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
  const [store, { setGameEvent }] = useStore()
  const navigate = useNavigate()
  const [selectedUser, setSelecteduser] = createSignal<Player>()
  const [selectedRound, setSelectedRound] = createSignal<Round>()

  const editRound = () => {
    navigate(`/edit_round/${selectedRound()?.id}`)
  }

  const removeRound = () => {
    const newRounds = store.gameEvent.rounds?.filter((r) => r.id !== selectedRound()?.id)
    setGameEvent({ ...store.gameEvent, rounds: newRounds })
    setSelectedRound()
  }

  const playRound = (id: Round["id"]) => {
    navigate(`/play_round/${id}`)
  }

  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center xss:pt-5 md:pt-28">
        {store.gameEvent.name || "Unknown"}
      </h1>
      <div class="flex justify-between xss:flex-col md:flex-row md:w-[80%] mx-auto mt-10">
        <div class="flex flex-col justify-center md:w-[45%]">
          <h6 class="text-lg font-bold dark:text-white md:text-lg flex items-center">
            <FaSolidUsers class="text-blue-300" />
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
                      <div class="flex items-center">
                        <span>
                          <span
                            classList={{
                              "text-green-500": i() == 0,
                              "text-yellow-600": i() == 1,
                              "text-orange-300": i() == 2,
                              "text-red-300": i() == 3,
                              "text-red-500": i() == 4,
                            }}
                          >
                            {i() + 1}.
                          </span>{" "}
                          {player.name}
                        </span>
                        <Show when={i() === 0}>
                          <TbConfetti class="text-yellow-700 text-xl mb-1 ml-2" />
                        </Show>
                      </div>
                      <p class="text-md text-gray-500 truncate dark:text-gray-400 mr-4">{player.points}</p>
                    </span>
                    <Show when={selectedUser()?.id == player.id}>
                      <button
                        type="button"
                        class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm p-2 text-center ml-2 animate-fadeIn"
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
        <div class="flex flex-col justify-start md:w-[45%] xss:mt-10 md:mt-0">
          <Show when={store.gameEvent.rounds && store.gameEvent.rounds?.length > 0} fallback={<EmptyRounds />}>
            <h6 class="text-lg font-bold dark:text-white md:text-lg flex items-center">
              <SiApachespark class="text-yellow-400" />
              <span class="ml-2">Rounds:</span>
            </h6>
            <ol class="w-full space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400 mt-6">
              <For each={store.gameEvent.rounds}>
                {(round, i) => {
                  return (
                    <li class="w-full flex items-center justify-between text-red-600 animate-fadeIn duration-100">
                      <div
                        class="flex justify-between font-medium text-gray-900 dark:text-white dark:hover:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer p-2 rounded-md w-full"
                        onclick={() => {
                          setSelectedRound(selectedRound() ? undefined : round)
                        }}
                      >
                        <span>{round.name}</span>
                        <span class="text-sm text-gray-600">
                          {DateTime.fromMillis(round.date).toLocaleString({}, { locale: "cs-CZ" })}
                        </span>
                      </div>
                      <Show when={selectedRound()?.id == round.id}>
                        <button
                          type="button"
                          class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm p-2 text-center ml-2  animate-fadeIn"
                          onclick={removeRound}
                        >
                          <RiSystemDeleteBin2Fill />
                        </button>
                        <button
                          type="button"
                          class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700  font-medium rounded-lg text-sm p-2 text-center ml-2  animate-fadeIn"
                          onclick={editRound}
                        >
                          <AiFillEdit class="cursor-pointer text-sm" />
                        </button>
                      </Show>
                      <Show when={!round.isFinished}>
                        <button
                          type="button"
                          class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm p-2 text-center ml-2  animate-fadeIn"
                          onclick={() => playRound(round.id)}
                        >
                          <FaSolidPlay class="cursor-pointer text-md" />
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
