import { createSignal, type Component } from "solid-js"
import "flowbite"
import { useNavigate } from "@solidjs/router"
import { useStore } from "../context/store"
import { apiGet } from "../api"
import { ApiGetGameEvent } from "../api/types"

const Home: Component = () => {
  console.log("Here")
  const navigate = useNavigate()
  const [store, { setGameEvent }] = useStore()
  const [gameName, setGameName] = createSignal("")

  const joinGame = async () => {
    const { data, error } = await apiGet<ApiGetGameEvent>(`games/name/${encodeURIComponent(gameName())}`)

    if (data) {
      setGameEvent({ ...data.gameInfo, players: data.players })
      navigate(`/overview_event/${data.gameInfo.id}`)
    }
  }

  return (
    <>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center pt-28">
        The Game
      </h1>
      <div class="mt-6 md:w-[50%] mx-auto">
        <input
          type="text"
          id="large-input"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Event Name like 'Day X'"
          value={gameName()}
          onchange={(e) => setGameName(e.target.value)}
        />
        <div class="mt-6 flex items-center justify-end">
          <button
            type="button"
            class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2 xss:w-1/3 md:w-36 transition-colors"
            onclick={() => navigate("/create_event")}
          >
            Create
          </button>
          <button
            disabled={gameName().length == 0}
            type="button"
            class=" text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-3 text-center mb-2 xss:w-1/3 md:w-36"
            onclick={joinGame}
            classList={{ "opacity-70 cursor-not-allowed": gameName().length === 0 }}
          >
            Join
          </button>
        </div>
      </div>
    </>
  )
}

export default Home

// const testGame: GameEvent = {
//   name: "Slay Quinz",
//   players: [
//     {
//       name: "Gregor",
//       points: 0,
//       id: 1,
//     },
//     {
//       name: "Bithch",
//       points: 2,
//       id: 12,
//     },
//     {
//       name: "Mem",
//       points: 2,
//       id: 13,
//     },
//     {
//       name: "Sdasd asda",
//       points: 2000,
//       id: 14,
//     },
//     {
//       name: "SAdasd asd asda sda",
//       points: -500,
//       id: 15,
//     },
//   ],
//   id: 0,
//   rounds: [
//     {
//       isFinished: false,
//       date: 1715703984460,
//       id: 1715703984460,
//       name: "Round 1",
//       players: [
//         {
//           name: "Gregor",
//           points: 0,
//           id: 1,
//         },
//         {
//           name: "Bithch",
//           points: 2,
//           id: 12,
//         },
//         {
//           name: "Mem",
//           points: 2,
//           id: 13,
//         },
//         {
//           name: "Sdasd asda",
//           points: 2000,
//           id: 14,
//         },
//         {
//           name: "SAdasd asd asda sda",
//           points: -500,
//           id: 15,
//         },
//       ],
//       themes: [
//         {
//           id: 1715703983930,
//           name: "Kisses 101",
//           questions: [
//             {
//               id: 1,
//               question: "asd",
//               answer: "asd",
//               points: 100,
//             },
//             {
//               id: 2,
//               question: "asd",
//               answer: "asd",
//               points: 200,
//             },
//             {
//               id: 3,
//               question: "asd",
//               answer: "asd",
//               points: 300,
//             },
//             {
//               id: 4,
//               question: "asd",
//               answer: "asd",
//               points: 400,
//             },
//             {
//               id: 5,
//               question: "asd",
//               answer: "asd",
//               points: 500,
//             },
//           ],
//         },
//         {
//           id: 1715703983931,
//           name: "Kisses 102",
//           questions: [
//             {
//               id: 1,
//               question: "asd",
//               answer: "asd",
//               points: 100,
//             },
//             {
//               id: 2,
//               question: "asd",
//               answer: "asd",
//               points: 200,
//             },
//             {
//               id: 3,
//               question: "asd",
//               answer: "asd",
//               points: 300,
//             },
//             {
//               id: 4,
//               question: "asd",
//               answer: "asd",
//               points: 400,
//             },
//             {
//               id: 5,
//               question: "asd",
//               answer: "asd",
//               points: 500,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       isFinished: true,
//       date: 1715703984461,
//       id: 1715703984461,
//       name: "asdasdasd",
//       players: [
//         {
//           name: "Gregor",
//           points: 0,
//           id: 1,
//         },
//         {
//           name: "Bithch",
//           points: 2,
//           id: 12,
//         },
//         {
//           name: "Mem",
//           points: 2,
//           id: 13,
//         },
//         {
//           name: "Sdasd asda",
//           points: 2000,
//           id: 14,
//         },
//         {
//           name: "SAdasd asd asda sda",
//           points: -500,
//           id: 15,
//         },
//       ],
//       themes: [
//         {
//           id: 1715703983930,
//           name: "asdasdasd",
//           questions: [
//             {
//               id: 1,
//               question: "asd",
//               answer: "asd",
//               points: 100,
//             },
//             {
//               id: 2,
//               question: "asd",
//               answer: "asd",
//               points: 200,
//             },
//             {
//               id: 3,
//               question: "asd",
//               answer: "asd",
//               points: 300,
//             },
//             {
//               id: 4,
//               question: "asd",
//               answer: "asd",
//               points: 400,
//             },
//             {
//               id: 5,
//               question: "asd",
//               answer: "asd",
//               points: 500,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }
