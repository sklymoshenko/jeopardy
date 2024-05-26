package api

import (
	"jeopardy/models"
	"strings"
)

func createThemeQueryBuilder(themes []models.Theme) (strings.Builder, []interface{}) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString("INSERT INTO Themes (theme_id, theme_name, round_id) VALUES ")

	for i, theme := range themes {
		if i > 0 {
			queryBuilder.WriteString(", ")
		}
		queryBuilder.WriteString("(?, ?, ?)")
		args = append(args, theme.ID, theme.Name, theme.RoundId)
	}

	queryBuilder.WriteString(";")

	return queryBuilder, args
}

func dbCreateTheme(themes []models.Theme) error {
	insertSQL, values := createThemeQueryBuilder(themes)
	_, err := DB.Exec(insertSQL.String(), values...)

	if err != nil {
		return err
	}

	return err
}
