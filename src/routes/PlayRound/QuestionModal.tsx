import { Component } from "solid-js"

type QuestionModalProps = {
  modalData?: {
    title: string
    question: string
    answer: string
  }
  revealAnswer: boolean
  onCloseClick: () => void
  onAnswerClick: () => void
  acceptAnswer: () => void
  incorrectAnswer: () => void
}

const QuestionModal: Component<QuestionModalProps> = (props) => {
  return (
    <div
      id="modalEl"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative max-h-full w-full max-w-2xl">
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div class="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl">{props.modalData?.title}</h3>
            <button
              type="button"
              class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onclick={props.onCloseClick}
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
            <p class="text-base leading-relaxed text-white">{props.modalData?.question}</p>
            <p
              class="text-sm leading-relaxed text-gray-500 dark:text-gray-400 blur-md cursor-pointer"
              classList={{ "blur-none": props.revealAnswer }}
              onclick={props.onAnswerClick}
            >
              {props.modalData?.answer}
            </p>
          </div>

          <div class="flex items-center space-x-2 rtl:space-x-reverse rounded-b border-t border-gray-200 p-6 dark:border-gray-600 justify-end">
            <button
              type="button"
              class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onclick={props.acceptAnswer}
            >
              Accept
            </button>
            <button
              type="button"
              class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onclick={props.incorrectAnswer}
            >
              No Way
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionModal
