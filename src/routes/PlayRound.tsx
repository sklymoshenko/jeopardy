import { useParams } from "@solidjs/router"
import { Component, For, Show, createSignal, onMount } from "solid-js"
import { useStore } from "../context/store"
import { Question, Round, Theme } from "../types"
import { OcQuestion2 } from "solid-icons/oc"

import { Modal } from "flowbite"
import type { ModalOptions, ModalInterface } from "flowbite"
import type { InstanceOptions } from "flowbite"

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
      const column: Column = { id: (i + 1).toString(), label: "" }
      if (i <= 3) {
        column.label = column.id + "00"
      } else {
        column.id = "10"
        column.label = "1000"
      }

      columns.push(column)
    }

    return columns
  }

  const [themes, setThemes] = createSignal<Round["themes"]>(JSON.parse(JSON.stringify(playingRound()?.themes)) || [])
  const [selectedQuestion, setSelectedQuestion] = createSignal<{ themeId: Theme["id"]; questionId: Question["id"] }>()
  const [revealAnswer, setReavealAnswer] = createSignal(false)

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

  const acceptAnswer = () => {
    answer(true)
    questionModal()?.toggle()
    setSelectedQuestion()
  }

  const incorrectAnswer = () => {
    answer(false)
    questionModal()?.toggle()
    setSelectedQuestion()
  }

  return (
    <div>
      <h1 class="dark:text-white mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl text-center xss:pt-5 md:pt-28">
        {playingRound()?.name || "Unknown"}
      </h1>
      <Show when={!!playingRound()}>
        <div class="xss:hidden md:flex">
          <table class="w-full border-collapse mt-4">
            <thead>
              <tr>
                <For each={columns()}>
                  {(column) => (
                    <th class={`text-base border border-1 text-center first:text-left p-2`}>{column.label}</th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={themes()}>
                {(theme) => {
                  console.log(theme.questions)
                  return (
                    <tr>
                      <td class="p-4">
                        <span class="font-bold text-xl">{theme.name}</span>
                      </td>
                      <For each={theme.questions}>
                        {(question, j) => {
                          console.log(question.id, question.isAnswered)
                          return (
                            <td class="p-4">
                              <span class="flex justify-center cursor-pointer hover:scale-125 transition-transform">
                                <button
                                  data-modal-target="default-modal"
                                  data-modal-toggle="default-modal"
                                  class="block "
                                  type="button"
                                  onclick={() => selectQuestion(theme.id, question.id)}
                                >
                                  <OcQuestion2
                                    class="text-xl"
                                    classList={{
                                      "text-green-400": question.isAnswered === undefined,
                                      "text-blue-400": question.isAnswered,
                                      "text-orange-500": question.isAnswered === false,
                                    }}
                                  />
                                </button>
                              </span>
                            </td>
                          )
                        }}
                      </For>
                    </tr>
                  )
                }}
              </For>
            </tbody>
          </table>
        </div>
        <div class="xss:flex md:hidden">"Hello" 2</div>
      </Show>
      <div
        id="modalEl"
        tabindex="-1"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative max-h-full w-full max-w-2xl">
          <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <div class="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl">{modalData()?.title}</h3>
              <button
                type="button"
                class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                onclick={() => questionModal()?.toggle()}
              >
                <svg
                  class="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <div class="space-y-6 p-6">
              <span>Question:</span>
              <p class="text-base leading-relaxed text-white">{modalData()?.question}</p>
              <p
                class="text-sm leading-relaxed text-gray-500 dark:text-gray-400 blur-md cursor-pointer"
                classList={{ "blur-none": revealAnswer() }}
                onclick={() => setReavealAnswer((prev) => !prev)}
              >
                {modalData()?.answer}
              </p>
            </div>

            <div class="flex items-center space-x-2 rtl:space-x-reverse rounded-b border-t border-gray-200 p-6 dark:border-gray-600 justify-end">
              <button
                type="button"
                class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onclick={acceptAnswer}
              >
                Accept
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onclick={incorrectAnswer}
              >
                No Way
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayRound
