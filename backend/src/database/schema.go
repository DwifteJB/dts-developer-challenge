package database

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model            // base model, id, createdat, etc etc...
	Title       string    `gorm:"not null"`
	Description string    `gorm:"default:null"` // optional
	Status      string    `gorm:"not null"`
	DueDate     time.Time `gorm:"not null"` // can be casted to string for frontend
}

var Schema = []interface{}{
	&Task{},
}
