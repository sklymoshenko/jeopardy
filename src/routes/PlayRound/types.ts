import { Question, Theme } from "../../types"

export type Column = {
  id: string
  label: string
}

export type TableProps = {
  columns: Column[]
  themes: Theme[]
  onQuestionClick: (themeId: Theme["id"], questionId: Question["id"]) => void
}
