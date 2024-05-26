package api

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type Api struct {
	g *gin.Engine
}

var DB *sql.DB

func (a *Api) CreateApi() {
	g := gin.Default()

	gameRouter(g)
	roundRouter(g)

	a.g = g
}

func (a Api) Run() {
	connectDatabase()
	a.g.Run()
}

func connectDatabase() error {
	log.Println("Connecting to db!")

	db, err := sql.Open("sqlite3", "db/jeopardy.db")

	if err != nil {
		log.Fatalf("Error while establishing connection to db: %v\n", err)
		return err
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v\n", err)
		return err
	}

	log.Println("Connected to the SQLite database successfully!")

	DB = db
	return nil
}
