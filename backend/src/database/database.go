// postgres database
package database

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// global db connection
var DB *gorm.DB

func InitDatabase() {

	// got from main.go (github.com/joho/godotenv)
	dsn := os.Getenv("POSTGRES_DSN")

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database:" + err.Error())
	}

	db.AutoMigrate(Schema...) // migrate schema

	// setup :0
	DB = db

}
