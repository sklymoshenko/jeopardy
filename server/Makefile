# Makefile

# Variables
DB_NAME=jeopardy
MIGRATIONS_DIR=db/migrations
DB_DRIVER=sqlite3

# Install dependencies
.PHONY: deps
deps:
	go mod tidy

# Run tests
.PHONY: test
test:
	go test ./...

# Build the project
.PHONY: build
build:
	go build -o bin/jeopardy

# Create a new migration
.PHONY: migration
migration:
	goose -dir $(MIGRATIONS_DIR) create $(name) sql

# Run migrations
.PHONY: m-up
m-up:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_NAME) up

# Rollback migrations
.PHONY: m-down
m-down:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_NAME) down

# Reset migrations
.PHONY: m-reset
m-reset:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_NAME) reset

# Status of migrations
.PHONY: m-status
m-status:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_NAME) status

# Fix for deprecated file_permissions
.PHONY: fix-file-permissions
fix-file-permissions:
	goose -dir $(MIGRATIONS_DIR) fix
