import { useParams } from "@solidjs/router"
import { Component, For, Show, createSignal, onMount } from "solid-js"
import { useStore } from "../../context/store"
import { Player, Question, Round, Theme } from "../../types"

import { Modal } from "flowbite"
import type { ModalOptions, ModalInterface } from "flowbite"
import type { InstanceOptions } from "flowbite"
import DesktopTable from "./DesktopTable"
import MobileCards from "./MobileCards"
import QuestionModal from "./QuestionModal"
import { FaSolidUsers } from "solid-icons/fa"
import { BsBalloonHeartFill } from "solid-icons/bs"
import { FaSolidMedal } from "solid-icons/fa"
import PlayersTurns from "./PlayersTurns"

type Column = { id: string; label: string }

const PlayRound: Component = () => {
  const [store, { setGameEvent }] = useStore()
  const [questionModal, setQuestionModal] = createSignal<ModalInterface>()
  const params = useParams()

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

  const playingRound = () => {
    if (params.id) {
      return store.gameEvent.rounds?.find((r) => r.id === +params.id)
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

  const [themes, setThemes] = createSignal<Round["themes"]>(JSON.parse(JSON.stringify(playingRound()?.themes)) || [])
  const [selectedQuestion, setSelectedQuestion] = createSignal<{ themeId: Theme["id"]; questionId: Question["id"] }>()
  const [revealAnswer, setReavealAnswer] = createSignal(false)
  const [roundPlayers, setRoundPlayers] = createSignal<Round["players"]>(
    JSON.parse(JSON.stringify(playingRound()?.players)).map((p: Player) => ({ ...p, points: 0 })) || []
  )

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
