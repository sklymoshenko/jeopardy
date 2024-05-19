package api

import (
	"jeopardy/models"
)

func dbGetGames() ([]models.Game, error) {
	rows, err := DB.Query("SELECT * FROM games")

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	games := make([]models.Game, 0)

	for rows.Next() {
		game := models.Game{}
		err = rows.Scan(&game.ID, &game.Name, &game.CreatedAt)

		if err != nil {
			return nil, err
		}

		games = append(games, game)
	}

	err = rows.Err()

	if err != nil {
		return nil, err
	}

	return games, nil
}

func getGameByName(name string) (models.Game, error) {
	querySQL := `SELECT game_id, game_name, created_at FROM Games WHERE game_name = ?`
	row := DB.QueryRow(querySQL, name)
	var game models.Game

	err := row.Scan(&game.ID, &game.Name, &game.CreatedAt)

	if err != nil {
		return models.Game{}, err
	}

	return game, nil
}

func dbCreateGame(newGame models.Game) (models.Game, error) {
	insertSQL := `INSERT INTO Games (game_id, game_name) VALUES (?, ?)`
	_, err := DB.Exec(insertSQL, newGame.ID, newGame.Name)

	if err != nil {
		return models.Game{}, err
	}

	return getGameByName(newGame.Name)
}
