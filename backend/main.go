package main

import (
	"fmt"
	"net/http"

	"github.com/DwifteJB/dts-developer-challenge/src/database"
	"github.com/DwifteJB/dts-developer-challenge/src/middleware"
	taskroutes "github.com/DwifteJB/dts-developer-challenge/src/routes/task"
	"github.com/go-chi/chi/v5"
	chimiddlewares "github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

// stopPrint makes testing cleaner
func RunServer(stopPrint bool) {

	// load env
	godotenv.Load()

	database.InitDatabase() // setup connection & migrate schema

	r := chi.NewRouter()

	if !stopPrint {
		r.Use(chimiddlewares.Logger) // testing to see if requests come through from the frontend
	}
	
	r.Use(middleware.CaseSensitiveMiddleware)

	// routes
	taskroutes.SetupRoutes(r)

	if !stopPrint {
		fmt.Println("backend running on http://localhost:3000")

		fmt.Println("Routes:")

		chi.Walk(r, func(method, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
			fmt.Printf("[%s]: %s\n", method, route) // prints [GET]: /tasks/:id
			return nil
		})
	}

	// run server

	// localhost:3000 to stop giving me windows firewall popups
	// http.ListenAndServe("localhost:3000", r)
	http.ListenAndServe(":3000", r)
}

func main() {
	RunServer(false)
}
