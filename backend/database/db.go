package database

import (
	"database/sql"
	"log"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

var (
	instance *sql.DB
	once     sync.Once
)

// GetDB returns the singleton database instance
func GetDB() *sql.DB {
	once.Do(func() {
		var err error
		instance, err = sql.Open("sqlite3", "./bible.db")
		if err != nil {
			log.Fatal("Failed to connect to database:", err)
		}

		// Test the connection
		if err = instance.Ping(); err != nil {
			log.Fatal("Failed to ping database:", err)
		}

		log.Println("Database connection established")
	})
	return instance
}

// CloseDB closes the database connection
func CloseDB() error {
	if instance != nil {
		return instance.Close()
	}
	return nil
}
