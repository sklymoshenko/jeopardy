-- +goose Up
-- +goose StatementBegin
CREATE TABLE Players (
  player_id INTEGER PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  points INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Games (
  game_id INTEGER PRIMARY KEY,
  game_name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PlayerGames (
  player_id INTEGER,
  game_id INTEGER,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, game_id),
  FOREIGN KEY (player_id) REFERENCES Players (player_id),
  FOREIGN KEY (game_id) REFERENCES Games (game_id)
);

CREATE TABLE Rounds (
  round_id INTEGER PRIMARY KEY,
  game_id INTEGER,
  round_name TEXT NOT NULL,
  is_finished INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES Games (game_id)
);

CREATE TABLE Themes (
  theme_id INTEGER PRIMARY KEY,
  round_id INTEGER,
  theme_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (round_id) REFERENCES Rounds (round_id)
);

CREATE TABLE Questions (
  theme_id INTEGER,
  question_id INTEGER PRIMARY KEY,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  points INTEGER,
  is_answered INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (theme_id) REFERENCES Themes (theme_id)
);

CREATE TABLE RoundPlayers (
  round_id INTEGER,
  player_id INTEGER,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (round_id, player_id),
  FOREIGN KEY (round_id) REFERENCES Rounds (round_id),
  FOREIGN KEY (player_id) REFERENCES Players (player_id)
);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS Players;

DROP TABLE IF EXISTS Games;

DROP TABLE IF EXISTS PlayerGames;

DROP TABLE IF EXISTS Rounds;

DROP TABLE IF EXISTS Themes;

DROP TABLE IF EXISTS Questions;

DROP TABLE IF EXISTS RoundPlayers;

-- +goose StatementEnd