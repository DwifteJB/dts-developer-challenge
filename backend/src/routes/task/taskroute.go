package taskroutes

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/DwifteJB/dts-developer-challenge/src/database"
	"github.com/DwifteJB/dts-developer-challenge/src/httpresponder"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type UpdateStatusRequest struct {
	Status string `json:"status"`
}

type CreateTaskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status"`
	DueDate     string `json:"dueDate"` // assume iso format for this
}

func SetupRoutes(r chi.Router) {
	r.Route("/task", func(r chi.Router) {

		r.Post("/create", func(w http.ResponseWriter, r *http.Request) {
			var req CreateTaskRequest
			err := json.NewDecoder(r.Body).Decode(&req)

			if err != nil {
				httpresponder.SendErrorResponse(w, r, "Invalid request body", http.StatusBadRequest)
				return
			}

			task := database.Task{
				Title:       req.Title,
				Description: req.Description,
				Status:      req.Status,
			}

			if req.DueDate != "" {
				parsedDueDate, err := time.Parse(time.RFC3339, req.DueDate) // e.g "2006-01-02T15:04:05Z07:00"
				if err != nil {
					httpresponder.SendErrorResponse(w, r, "Invalid due date format", http.StatusBadRequest)
					return
				}
				task.DueDate = parsedDueDate
			}

			err = database.DB.Create(&task).Error
			if err != nil {
				httpresponder.SendErrorResponse(w, r, "Failed to create task", http.StatusInternalServerError)
				return
			}

			httpresponder.SendNormalResponse(w, r, task)
		})

		// /task/all
		r.Get("/all", func(w http.ResponseWriter, r *http.Request) {
			tasks, err := gorm.G[database.Task](database.DB).Find(r.Context())

			if err != nil {
				httpresponder.SendErrorResponse(w, r, "Failed to retrieve tasks", http.StatusInternalServerError)
				return
			}

			httpresponder.SendNormalResponse(w, r, tasks)
		})

		r.Route("/{id}", func(r chi.Router) {
			// task/:id
			r.Get("/", func(w http.ResponseWriter, r *http.Request) {
				// read param
				idparam := chi.URLParam(r, "id")

				task, err := gorm.G[database.Task](database.DB).Where("id = ?", idparam).First(r.Context())

				if err != nil {
					httpresponder.SendErrorResponse(w, r, "Failed to retrieve task", http.StatusInternalServerError)
					return
				}

				httpresponder.SendNormalResponse(w, r, task)
			})

			// /task/:id/delete
			r.Post("/delete", func(w http.ResponseWriter, r *http.Request) {
				idparam := chi.URLParam(r, "id")

				rowsEffected, err := gorm.G[database.Task](database.DB).Where("id = ?", idparam).Delete(r.Context())

				if err != nil || rowsEffected == 0 {
					httpresponder.SendErrorResponse(w, r, "Failed to delete task", http.StatusInternalServerError)
					return
				}

				httpresponder.SendNormalResponse(w, r, map[string]string{"message": "Task deleted successfully"})
			})

			// /task/:id/update
			r.Post("/update", func(w http.ResponseWriter, r *http.Request) {
				var req UpdateStatusRequest
				err := json.NewDecoder(r.Body).Decode(&req)

				if err != nil {
					httpresponder.SendErrorResponse(w, r, "Invalid request body", http.StatusBadRequest)
					return
				}

				idparam := chi.URLParam(r, "id")

				rowsEffected, err := gorm.G[database.Task](database.DB).Where("id = ?", idparam).Update(r.Context(), "status", req.Status)

				if err != nil {
					httpresponder.SendErrorResponse(w, r, "Failed to update task status", http.StatusInternalServerError)
					return
				}

				if rowsEffected == 0 {
					httpresponder.SendErrorResponse(w, r, "Task not found", http.StatusNotFound)
					return
				}

				httpresponder.SendNormalResponse(w, r, map[string]string{"message": "Task status updated successfully"})
			})

		})
	})
}
