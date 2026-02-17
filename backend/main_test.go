package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	taskroutes "github.com/DwifteJB/dts-developer-challenge/src/routes/task"
)

type ServerTask struct {
	taskroutes.CreateTaskRequest
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"` // via gorm
}

func createTask() (*ServerTask, error) {
	// creates an example task (required for pretty much every test lol)

	task := taskroutes.CreateTaskRequest{
		Title:       "Title",
		Description: "test",
		Status:      "todo",
		DueDate:     time.Now().Format(time.RFC3339),
	}

	// send request to backend

	jsonBody, _ := json.Marshal(task)
	resp, err := http.Post("http://localhost:3000/task/create", "application/json", bytes.NewBuffer(jsonBody))

	if err != nil {
		return nil, err
	}

	// 200 assume success, otherwise something went wrong
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var createdTask ServerTask
	err = json.NewDecoder(resp.Body).Decode(&createdTask)
	if err != nil {
		return nil, err
	}

	return &createdTask, nil
}

func waitForServer() {
	// wait for ping at localhost:3000 (should be 404)

	for {
		resp, err := http.Get("http://localhost:3000/")
		if err == nil {
			resp.Body.Close()
			break
		}
		time.Sleep(100 * time.Millisecond) // to not use all the cpu waiting
	}
}

func TestCreateTask(t *testing.T) {
	go RunServer(true) // start the server in a goroutine
	waitForServer()

	_, err := createTask()
	print("err", err)
	if err != nil {
		t.Error(err)
	}
}

func TestGetAllTasks(t *testing.T) {
	go RunServer(true) // start the server in a goroutine
	waitForServer()

	_, err := createTask() // create a task to make sure there is at least 1 task in the database
	if err != nil {
		t.Error(err)
	}

	resp, err := http.Get("http://localhost:3000/task/all")
	if err != nil {
		t.Error(err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var tasks []ServerTask
	err = json.NewDecoder(resp.Body).Decode(&tasks)

	// check to see if the task we created is in the response
	found := false
	for _, task := range tasks {
		if task.Title == "Title" && task.Description == "test" && task.Status == "todo" {
			found = true
			break
		}
	}

	if !found {
		t.Error("created task not found in response")
	}
}

// delete task via id

func TestDeleteTask(t *testing.T) {
	go RunServer(true)
	waitForServer()

	createdTask, err := createTask() // create a task to delete
	if err != nil {
		t.Error(err)
	}

	// delete the task we just created
	resp, err := http.Post("http://localhost:3000/task/"+fmt.Sprint(createdTask.ID)+"/delete", "application/json", nil)
	if err != nil {
		t.Error(err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("unexpected status code: %d", resp.StatusCode)
	}
}

func TestUpdateTask(t *testing.T) {
	go RunServer(true)
	waitForServer()

	createdTask, err := createTask() // create a task to update
	if err != nil {
		t.Error(err)
	}

	updateReq := taskroutes.UpdateStatusRequest{
		Status: "complete",
	}

	jsonBody, _ := json.Marshal(updateReq)
	resp, err := http.Post("http://localhost:3000/task/"+fmt.Sprint(createdTask.ID)+"/update", "application/json", bytes.NewBuffer(jsonBody))

	if err != nil {
		t.Error(err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// find task by id to see if it was updated

	resp, err = http.Get("http://localhost:3000/task/" + fmt.Sprint(createdTask.ID))
	if err != nil {
		t.Error(err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var updatedTask ServerTask
	err = json.NewDecoder(resp.Body).Decode(&updatedTask)

	if err != nil {
		t.Error(err)
	}

	if updatedTask.Status != "complete" {
		t.Errorf("expected status to be 'complete', got '%s'", updatedTask.Status)
	}

}
