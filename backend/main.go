package main

import (
	"bible-app/database"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type Verse struct {
	Verse int    `json:"verse"`
	Text  string `json:"text"`
}

type Chapter struct {
	Book     string  `json:"book"`
	Chapter  int     `json:"chapter"`
	Language string  `json:"language"`
	Verses   []Verse `json:"verses"`
}

type BooksResponse struct {
	Books []string `json:"books"`
}

type ChaptersResponse struct {
	Chapters []int `json:"chapters"`
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func getChapterHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	if r.Method == "OPTIONS" {
		return
	}

	// Parse URL path: /api/chapter/{book}/{chapter}
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) != 4 || pathParts[0] != "api" || pathParts[1] != "chapter" {
		http.Error(w, "Invalid path format. Use /api/chapter/{book}/{chapter}", http.StatusBadRequest)
		return
	}

	book := pathParts[2]
	chapterNum := pathParts[3]
	language := r.URL.Query().Get("lang")
	if language == "" {
		language = "eng" // default language
	}

	// Construct file path
	filePath := filepath.Join("..", "Bible", book, chapterNum, language+".json")
	
	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Chapter not found", http.StatusNotFound)
		return
	}

	// Read file
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		http.Error(w, "Error reading chapter", http.StatusInternalServerError)
		return
	}

	// Parse JSON to validate
	var chapter Chapter
	if err := json.Unmarshal(data, &chapter); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func getBooksHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	if r.Method == "OPTIONS" {
		return
	}

	bibleDir := "../Bible"
	books := []string{}

	entries, err := ioutil.ReadDir(bibleDir)
	if err != nil {
		http.Error(w, "Error reading Bible directory", http.StatusInternalServerError)
		return
	}

	for _, entry := range entries {
		if entry.IsDir() {
			books = append(books, entry.Name())
		}
	}

	response := BooksResponse{Books: books}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getChaptersHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	if r.Method == "OPTIONS" {
		return
	}

	// Parse URL path: /api/chapters/{book}
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) != 3 || pathParts[0] != "api" || pathParts[1] != "chapters" {
		http.Error(w, "Invalid path format. Use /api/chapters/{book}", http.StatusBadRequest)
		return
	}

	book := pathParts[2]
	bookDir := filepath.Join("..", "Bible", book)
	chapters := []int{}

	entries, err := ioutil.ReadDir(bookDir)
	if err != nil {
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	}

	for _, entry := range entries {
		if entry.IsDir() {
			var chapterNum int
			if _, err := fmt.Sscanf(entry.Name(), "%d", &chapterNum); err == nil {
				chapters = append(chapters, chapterNum)
			}
		}
	}

	response := ChaptersResponse{Chapters: chapters}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	// Initialize database connection (singleton)
	_ = database.GetDB()
	defer database.CloseDB()

	log.Println("Database singleton initialized")

	// Setup routes
	http.HandleFunc("/api/chapter/", getChapterHandler)
	http.HandleFunc("/api/books", getBooksHandler)
	http.HandleFunc("/api/chapters/", getChaptersHandler)

	// Health check endpoint
	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	port := ":8080"
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
