import { useNavigate, useParams } from "@solidjs/router"
import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js"
import { useStore } from "../../context/store"
import { GameEvent, Player, Question, Round, Theme } from "../../types"

import { Modal } from "flowbite"
import type { ModalOptions, ModalInterface } from "flowbite"
import type { InstanceOptions } from "flowbite"
import DesktopTable from "./DesktopTable"
import MobileCards from "./MobileCards"
import QuestionModal from "./QuestionModal"
import PlayersTurns from "./PlayersTurns"

const RoundKey = "playing_round"

type Column = { id: string; label: string }

const PlayRound: Component = () => {
  const [store, { setGameEvent }] = useStore()
  const navigate = useNavigate()
  const [questionModal, setQuestionModal] = createSignal<ModalInterface>()
  const params = useParams()

  const getSavedRound = (): Round | undefined => {
    const item = localStorage.getItem(RoundKey)

    if (item) {
      const round: Round = JSON.parse(item)

      return round
    }
  }

  onMount(() => {
    const $modalElement = document.querySelector<HTMLElement>("#modalEl")!

    const modalOptions: ModalOptions = {
      placement: "center",
      backdrop: "dynamic",
      backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
      closable: true,
    }

    // instance options object
    const instanceOptions: InstanceOptions = {
      id: "modalEl",
      override: true,
    }

    const modal: ModalInterface = new Modal($modalElement, modalOptions, instanceOptions)

    setQuestionModal(modal)
  })

  const playingRound = (): Round | undefined => {
    const storedRound = getSavedRound()

    if (storedRound) {
      return storedRound
    }

    if (params.id) {
      let storeRound = store.gameEvent.rounds?.find((r) => r.id === +params.id)
      if (storeRound) {
        storeRound.players = storeRound.players.map((p: Player) => ({ ...p, points: 0 }))
        return JSON.parse(JSON.stringify(storeRound))
      }
    }
  }

  const columns = () => {
    const largestTheme = playingRound()?.themes.reduce<Round["themes"][number]>(
      (acc, curr) => {
        if (curr.questions.length > acc.questions.length) {
          acc = curr
        }

        return acc
      },
      { questions: [], id: 0, name: "" }
    ) || { id: 0, questions: [] }

    const columns: Column[] = [{ id: "names", label: "" }]

    for (let i = 0; i < largestTheme.questions.length; i++) {
      const val = largestTheme.questions[i].points.toString()
      const column: Column = { id: val, label: val }

      columns.push(column)
    }

    return columns
  }

  const [themes, setThemes] = createSignal<Round["themes"]>(playingRound()?.themes || [])
  const [selectedQuestion, setSelectedQuestion] = createSignal<{ themeId: Theme["id"]; questionId: Question["id"] }>()
  const [revealAnswer, setReavealAnswer] = createSignal(false)
  const [roundPlayers, setRoundPlayers] = createSignal<Round["players"]>(playingRound()?.players || [])

  const [playerTurn, setPlayerTurn] = createSignal<Round["players"][number]>(
    roundPlayers()[Math.floor(Math.random() * roundPlayers().length)]
  )

  const selectQuestion = (theme: Theme["id"], question: Question["id"]) => {
    setSelectedQuestion({ themeId: theme, questionId: question })
    questionModal()?.show()
  }

  const selectedToAnswer = () => {
    const themeIndex = themes().findIndex((th) => th.id === selectedQuestion()?.themeId)

    if (themeIndex >= 0) {
      const questionIndex = themes()[themeIndex].questions.findIndex((q) => q.id === selectedQuestion()?.questionId)

      if (questionIndex >= 0) {
        return { themeIndex, questionIndex }
      }
    }

    return { themeIndex: -1, questionIndex: -1 }
  }

  const modalData = (): { title: string; question: string; answer: string } => {
    const { themeIndex, questionIndex } = selectedToAnswer()

    if (themeIndex !== -1) {
      const theme = themes()[themeIndex]
      const question = theme.questions[questionIndex]

      if (!!question) {
        return { title: `${theme.name} for ${question.points}`, question: question.question, answer: question.answer }
      }
    }

    return { title: "Unknown", question: "Unknown", answer: "Unknown" }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem(RoundKey, JSON.stringify({ ...playingRound(), players: roundPlayers(), themes: themes() }))
  }

  const finishRound = () => {
    const newRound = JSON.parse(
      JSON.stringify({ ...playingRound(), players: roundPlayers(), themes: themes(), isFinished: true } as Round)
    )
    const roundIndex = store.gameEvent.rounds!.findIndex((r) => r.id === newRound.id)

    if (roundIndex >= 0) {
      const newGameEvent: GameEvent = JSON.parse(JSON.stringify(store.gameEvent))
      newGameEvent.rounds![roundIndex] = newRound
      setGameEvent(newGameEvent)
      navigate(`/overview_event`)
    }
  }

  const answer = (isAccepted: boolean) => {
    const { themeIndex, questionIndex } = selectedToAnswer()

    if (themeIndex !== -1) {
      const newQuestions = [...themes()[themeIndex].questions]
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], isAnswered: isAccepted }

      const newThemes = [...themes()]
      newThemes[themeIndex] = { ...newThemes[themeIndex], questions: [...newQuestions] }

      setThemes(newThemes)
    }
  }

  const moveToNextPlayer = () => {
    const currIndex = roundPlayers().findIndex((p) => p.id === playerTurn().id)

    if (currIndex >= 0) {
      if (currIndex + 1 > roundPlayers().length - 1) {
        setPlayerTurn(roundPlayers()[0])
      } else {
        setPlayerTurn(roundPlayers()[currIndex + 1])
      }

      return currIndex
    }

    return undefined
  }

  const winningPlayer = () => {
    return [...roundPlayers()].sort((a, b) => b.points - a.points)[0]
  }

  const resetPlayerRoundData = () => {
    const currIndex = moveToNextPlayer()

    if (currIndex == undefined) {
      return
    }

    const newPlayers: Round["players"] = JSON.parse(JSON.stringify(roundPlayers()))
    const { themeIndex, questionIndex } = selectedToAnswer()
    if (themeIndex < 0) return

    const question = themes()[themeIndex].questions[questionIndex]
    newPlayers[currIndex].points += question.isAnswered ? question.points : -question.points
    setRoundPlayers(newPlayers)

    questionModal()?.toggle()
    setSelectedQuestion()
  }

  const acceptAnswer = () => {
    answer(true)
    resetPlayerRoundData()
  }

  const incorrectAnswer = () => {
    answer(false)
    resetPlayerRoundData()
  }

  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center xss:pt-5 md:pt-28">
        {playingRound()?.name || "Unknown"}
      </h1>
      <Show when={!!playingRound()}>
        <DesktopTable columns={columns()} themes={themes()} onQuestionClick={selectQuestion} />
        <MobileCards columns={columns()} themes={themes()} onQuestionClick={selectQuestion} />
      </Show>
      <PlayersTurns
        onPlayerClick={setPlayerTurn}
        playerTurn={playerTurn()}
        roundPlayers={roundPlayers()}
        winningPlayer={winningPlayer()}
      />
      <div class="flex justify-between lg:justify-center my-12">
        <button
          type="button"
          class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center xss:w-[45%] lg:w-[20%] md:w-[33%] lg:mr-4"
          onclick={saveToLocalStorage}
        >
          Save Round
        </button>
        <button
          type="button"
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center xss:w-[45%] lg:w-[20%] md:w-[33%]"
          onclick={finishRound}
        >
          Finish Round
        </button>
      </div>
      <QuestionModal
        acceptAnswer={acceptAnswer}
        incorrectAnswer={incorrectAnswer}
        modalData={modalData()}
        onAnswerClick={() => setReavealAnswer((prev) => !prev)}
        revealAnswer={revealAnswer()}
        onCloseClick={() => questionModal()?.toggle()}
      />
    </div>
  )
}

export default PlayRound
