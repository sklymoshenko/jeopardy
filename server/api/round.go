package api

import (
	"jeopardy/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RoundResponse struct {
	RoundInfo models.Round      `json:"roundInfo"`
	Themes    []models.Theme    `json:"themes"`
	Questions []models.Question `json:"questions"`
	Players   []models.Player   `json:"players"`
}

func roundsByGame(c *gin.Context) {
	gameId := c.Param("id")

	gameIdInt, err := strconv.Atoi(gameId)

	if err != nil {
		log.Println("Invalid parametr for game id:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	round, err := dbGetRoundsByGameId(gameIdInt)

	if err != nil {
		log.Println("Error while db call 'get game by id'", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	players, err := dbGetPlayersByRoundId(round.ID)

	if err != nil {
		log.Println("Error while db call 'get players by game id'", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving game by id"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": RoundResponse{RoundInfo: round, Players: players}})
}

func roundById(c *gin.Context) {
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

type Round struct {
	RoundInfo models.Round      `json:"roundInfo"`
	Themes    []models.Theme    `json:"themes"`
	Questions []models.Question `json:"questions"`
	PlayerIds []int             `json:"playerIds"`
}

func createRound(c *gin.Context) {
	var newRoundBody Round

	// Bind the JSON payload to the newGame struct
	if err := c.ShouldBindJSON(&newRoundBody); err != nil {
		log.Println("Error parsing req body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("Creating round name:", newRoundBody.RoundInfo.Name)

	err := dbCreateRound(newRoundBody.RoundInfo, newRoundBody.PlayerIds)

	if err != nil {
		log.Println("Error while db call 'create round':", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating a round"})
		return
	}

	err = dbCreateTheme(newRoundBody.Themes)

	if err != nil {
		log.Println("Error while db call 'create theme':", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating a round"})
		return
	}

	err = dbCreateQuestion(newRoundBody.Questions)

	if err != nil {
		log.Println("Error while db call 'create questions':", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating a round"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Done"})
}

func roundRouter(g *gin.Engine) {
	router := g.Group("/rounds")

	{
		router.GET("/gameId/:gameId/", roundsByGame)
		router.GET("/:id/", roundById)
		router.POST("/", createRound)
	}
}
