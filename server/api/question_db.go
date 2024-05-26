package api

import (
	"jeopardy/models"
	"strings"
)

func createQuestionQueryBuilder(questions []models.Question) (strings.Builder, []interface{}) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString("INSERT INTO Questions (question_id, question_text, answer_text, theme_id) VALUES ")

	for i, question := range questions {
		if i > 0 {
			queryBuilder.WriteString(", ")
		}
		queryBuilder.WriteString("(?, ?, ?, ?)")
		args = append(args, question.ID, question.QuestionText, question.AnswerText, question.ThemeId)
	}

	queryBuilder.WriteString(";")

	return queryBuilder, args
}

func dbCreateQuestion(questions []models.Question) error {
	insertSQL, values := createQuestionQueryBuilder(questions)
	_, err := DB.Exec(insertSQL.String(), values...)

	if err != nil {
		return err
	}

	return err
}
