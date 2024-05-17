import { BsBalloonHeartFill } from "solid-icons/bs"
import { FaSolidUsers, FaSolidMedal } from "solid-icons/fa"
import { Component, For, Show, createEffect } from "solid-js"
import { Round } from "../../types"

type PlayersTurnsProps = {
  roundPlayers: Round["players"]
  onPlayerClick: (player: Round["players"][number]) => void
  winningPlayer: Round["players"][number]
  playerTurn: Round["players"][number]
}

const PlayersTurns: Component<PlayersTurnsProps> = (props) => {
  return (
    <div class="flex mt-14 flex-col">
      <h6 class="text-lg font-bold dark:text-white md:text-lg flex items-center">
        <FaSolidUsers class="text-blue-300" />
        <span class="ml-2">Players Turns and Scores:</span>
      </h6>
      <ol class="md:flex md:flex-col md:text-lg md:w-1/2 lg:w-1/4">
        <For each={props.roundPlayers}>
          {(player) => {
            return (
              <li
                class="flex items-center justify-between font-medium text-gray-900 dark:text-white w-full text-base  dark:hover:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer p-4 rounded-md"
                onclick={() => props.onPlayerClick(player)}
              >
                <div class="flex items-center">
                  <span>{player.name}</span>
                  <Show
                    when={
                      props.winningPlayer.id == player.id ||
                      (props.winningPlayer.points == player.points && player.points != 0)
                    }
                  >
                    <FaSolidMedal class="text-yellow-200 ml-4 text-xl" />
                  </Show>
                  <Show when={props.playerTurn?.id == player.id}>
                    <BsBalloonHeartFill class="text-orange-500 animate-bounce ml-4 text-xl" />
                  </Show>
                </div>
                <span>{player.points}</span>
              </li>
            )
          }}
        </For>
      </ol>
    </div>
  )
}

export default PlayersTurns
