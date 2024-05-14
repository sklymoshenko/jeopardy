import { OcQuestion2 } from "solid-icons/oc"
import { Component, For } from "solid-js"
import { TableProps } from "./types"

const DesktopTable: Component<TableProps> = (props) => {
  return (
    <div class="xss:hidden md:flex">
      <table class="w-full border-collapse mt-4">
        <thead>
          <tr>
            <For each={props.columns}>
              {(column) => <th class={`text-base border border-1 text-center first:text-left p-2`}>{column.label}</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.themes}>
            {(theme) => {
              return (
                <tr>
                  <td class="p-4">
                    <span class="font-bold text-xl">{theme.name}</span>
                  </td>
                  <For each={theme.questions}>
                    {(question, j) => {
                      return (
                        <td class="p-4">
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
  )
}

export default DesktopTable
