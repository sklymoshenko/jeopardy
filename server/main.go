package main

import "jeopardy/api"

func main() {
	server := api.Api{}

	server.CreateApi()
	server.Run()
}
