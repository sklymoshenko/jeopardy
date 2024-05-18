package api

import "github.com/gin-gonic/gin"

func getGames(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Hello world"})
}

func gameRouter(g *gin.Engine) {
	router := g.Group("/games")

	{
		router.GET("/", getGames)
	}
}
