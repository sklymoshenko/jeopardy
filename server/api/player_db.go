package api

import (
	"jeopardy/models"
	"strings"
)

func dbGetPlayerById(id int) (models.Player, error) {
	querySQL := `SELECT player_id, player_name, created_at, points FROM Players WHERE player_id = ?`
	row := DB.QueryRow(querySQL, id)
	var player models.Player

	err := row.Scan(&player.ID, &player.Name, &player.CreatedAt, &player.Points)

	if err != nil {
		return models.Player{}, err
	}

	return player, nil
}

func dbGetPlayersByGameId(gameId int) ([]models.Player, error) {
	players := make([]models.Player, 0)
	singlePlayer := models.Player{}

	querySQL := `
		SELECT p.player_id, p.player_name, p.points, p.created_at
		FROM Players p
		JOIN PlayerGames pg ON p.player_id = pg.player_id
		WHERE pg.game_id = ?;
	`

	rows, err := DB.Query(querySQL, gameId)

	if err != nil {
		return players, err
	}

	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(&singlePlayer.ID, &singlePlayer.Name, &singlePlayer.Points, &singlePlayer.CreatedAt)

		if err != nil {
			return make([]models.Player, 0), err
		}

		players = append(players, singlePlayer)
		singlePlayer = models.Player{}
	}

	return players, nil
}

func playerGameRelationQueryBuilder(newPlayers []models.Player, gameId int) (strings.Builder, []interface{}) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString("INSERT INTO PlayerGames (player_id, game_id) VALUES ")

	for i, player := range newPlayers {
		if i > 0 {
			queryBuilder.WriteString(", ")
		}
		queryBuilder.WriteString("(?, ?)")
		args = append(args, player.ID, gameId)
	}

	queryBuilder.WriteString(";")

	return queryBuilder, args
}

func savePlayerGameRelation(newPlayers []models.Player, gameId int) error {
	insertSQL, values := playerGameRelationQueryBuilder(newPlayers, gameId)

	_, err := DB.Exec(insertSQL.String(), values...)

	if err != nil {
		return err
	}

	return nil
}

func createPlayerQueryBuilder(players []models.Player) (strings.Builder, []interface{}) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString("INSERT INTO Players (player_id, player_name) VALUES ")

	for i, player := range players {
		if i > 0 {
			queryBuilder.WriteString(", ")
		}
		queryBuilder.WriteString("(?, ?)")
		args = append(args, player.ID, player.Name)
	}

	queryBuilder.WriteString(";")

	return queryBuilder, args
}

func createPlayer(newPlayers []models.Player, gameId int) error {
	insertSQL, values := createPlayerQueryBuilder(newPlayers)
	_, err := DB.Exec(insertSQL.String(), values...)

	if err != nil {
		return err
	}

	err = savePlayerGameRelation(newPlayers, gameId)

	if err != nil {
		return err
	}

	return err
}
