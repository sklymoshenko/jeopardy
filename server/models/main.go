package models

type Game struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	CreatedAt string `json:"createdAt"`
}

type Player struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Points    int    `json:"points"`
	CreatedAt string `json:"createdAt"`
}

type Round struct {
	ID         int    `json:"id"`
	GameId     int    `json:"gameId"`
	Name       string `json:"name"`
	IsFinished int    `json:"isFinished"`
	CreatedAt  string `json:"createdAt"`
}

type Theme struct {
	ID        int    `json:"id"`
	RoundId   int    `json:"roundId"`
	Name      string `json:"name"`
	CreatedAt string `json:"createdAt"`
}

type Question struct {
	ID           int    `json:"id"`
	ThemeId      int    `json:"themeId"`
	QuestionText string `json:"question"`
	AnswerText   string `json:"answer"`
	Points       int    `json:"points"`
	IsAnswered   int    `json:"isAnswered"`
	CreatedAt    string `json:"createdAt"`
}
