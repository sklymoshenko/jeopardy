package api

import (
	"jeopardy/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func getGames(c *gin.Context) {
	games, err := dbGetGames()

	if err != nil {
		log.Println("Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving games"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": games})
}

type Game struct {
	GameInfo models.Game     `json:"gameInfo"`
	Players  []models.Player `json:"players"`
}

func createGame(c *gin.Context) {
	var newGameBody Game

	// Bind the JSON payload to the newGame struct
	if err := c.ShouldBindJSON(&newGameBody); err != nil {
		log.Println("Error parsing req body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("Creating game name:", newGameBody.GameInfo.Name)

	game, err := dbCreateGame(newGameBody.GameInfo)

	if err != nil {
		log.Println("Error while db call 'create game':", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating a game"})
		return
	}

	err = createPlayer(newGameBody.Players, newGameBody.GameInfo.ID)

	if err != nil {
		log.Println("Error while db call 'create player':", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating a game"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}

func gameById(c *gin.Context) {
	gameId := c.Param("id")

	gameIdInt, err := strconv.Atoi(gameId)

	if err != nil {
		log.Println("Invalid parametr for game id:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	game, err := dbGetGameById(gameIdInt)

	if err != nil {
		log.Println("Error while db call 'get game by id'", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	players, err := dbGetPlayersByGameId(gameIdInt)

	if err != nil {
		log.Println("Error while db call 'get players by game id'", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Game{GameInfo: game, Players: players}})
}

func gameByName(c *gin.Context) {
	gameName := c.Param("name")

	if gameName == "" {
		log.Println("Invalid parametr for game name")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by name"})
		return
	}

	game, err := dbGetGameByName(gameName)

	if err != nil {
		log.Println("Error while db call 'get game by name'", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by name"})
		return
	}

	players, err := dbGetPlayersByGameId(game.ID)

	if err != nil {
		log.Println("Error while db call 'get players by game id'", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Game{GameInfo: game, Players: players}})
}

func gameRouter(g *gin.Engine) {
	router := g.Group("/games")

	{
		router.GET("/", getGames)
		router.GET("/:id/", gameById)
		router.GET("/name/:name/", gameByName)
		router.POST("/", createGame)
	}
}
