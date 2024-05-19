package api

import (
	"jeopardy/models"
	"log"
	"net/http"

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

func createGame(c *gin.Context) {
	var newGame models.Game

	// Bind the JSON payload to the newGame struct
	if err := c.ShouldBindJSON(&newGame); err != nil {
		log.Println("Error parsing req body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	game, err := dbCreateGame(newGame)

	if err != nil {
		log.Println("Error while db call:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating a game"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}

func gameRouter(g *gin.Engine) {
	router := g.Group("/games")

	{
		router.GET("/", getGames)
		router.POST("/", createGame)
	}
}
