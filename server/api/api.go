package api

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type Api struct {
	g *gin.Engine
}

var DB *sql.DB

func (a *Api) CreateApi() {
	g := gin.Default()

	gameRouter(g)

	a.g = g
}

func (a Api) Run() {
	a.g.Run()
}

func (a Api) ConnectDatabase() error {
	db, err := sql.Open("sqlite3", "./sqlite.db")
	if err != nil {
		return err
	}

	DB = db
	return nil
}
