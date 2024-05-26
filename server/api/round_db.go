package api

import (
	"jeopardy/models"
	"strings"
)

func dbGetRoundsByGameId(id int) (models.Round, error) {
	querySQL := `SELECT round_id, game_id, round_name, is_finished, created_at FROM Rounds WHERE game_id = ?`
	row := DB.QueryRow(querySQL, id)
	var round models.Round

	err := row.Scan(&round.ID, &round.Name, &round.CreatedAt, &round.GameId, &round.IsFinished)

	if err != nil {
		return models.Round{}, err
	}

	return round, nil
}

func dbGetPlayersByRoundId(roundId int) ([]models.Player, error) {
	players := make([]models.Player, 0)
	singlePlayer := models.Player{}

	querySQL := `
		SELECT p.player_id, p.player_name, p.points, p.created_at
		FROM Players p
		JOIN RoundPlayers pg ON p.player_id = pg.player_id
		WHERE pg.round_id = ?;
	`

	rows, err := DB.Query(querySQL, roundId)

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

func playerRoundRelationQueryBuilder(playerIds []int, roundId int) (strings.Builder, []interface{}) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString("INSERT INTO RoundPlayers (player_id, round_id) VALUES ")

	for i, playerId := range playerIds {
		if i > 0 {
			queryBuilder.WriteString(", ")
		}
		queryBuilder.WriteString("(?, ?)")
		args = append(args, playerId, roundId)
	}

	queryBuilder.WriteString(";")

	return queryBuilder, args
}

func savePlayerRoundRelation(playerIds []int, gameId int) error {
	insertSQL, values := playerRoundRelationQueryBuilder(playerIds, gameId)

	_, err := DB.Exec(insertSQL.String(), values...)

	if err != nil {
		return err
	}

	return nil
}

func dbCreateRound(newRound models.Round, playerIds []int) error {
	insertSQL := `INSERT INTO Rounds (round_id, round_name, game_id) VALUES (?, ?, ?)`
	_, err := DB.Exec(insertSQL, newRound.ID, newRound.Name, newRound.GameId)

	if err != nil {
		return err
	}

	err = savePlayerRoundRelation(playerIds, newRound.ID)

	if err != nil {
		return err
	}

	return nil
}
