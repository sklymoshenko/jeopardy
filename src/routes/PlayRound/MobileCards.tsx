import { Component, For } from "solid-js"
import { TableProps } from "./types"
import { OcQuestion2 } from "solid-icons/oc"

const MobileCards: Component<TableProps> = (props) => {
  return (
    <div class="flex-col xss:flex md:hidden">
      <For each={props.themes}>
        {(theme) => {
          return (
            <div class="max-w-sm p-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-2">
              <h5 class="text-lg font-bold text-center mb-2">{theme.name}</h5>
              <ol>
                <For each={theme.questions}>
                  {(question) => {
                    return (
                      <li class="p-2 flex items-center justify-between">
                        <h5 class="tracking-tight text-gray-900 dark:text-white">{question.points}:</h5>
                        <span class="flex justify-center cursor-pointer hover:scale-125 transition-transform">
                          <button
                            data-modal-target="default-modal"
                            data-modal-toggle="default-modal"
                            class="block "
                            type="button"
                            onclick={() => props.onQuestionClick(theme.id, question.id)}
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
                      </li>
                    )
                  }}
                </For>
              </ol>
            </div>
          )
        }}
      </For>
    </div>
  )
}

export default MobileCards
