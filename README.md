# Bible App

Una semplice applicazione per leggere la Bibbia con backend Golang e frontend React.

## Struttura del Progetto

```
Bible/app/
├── backend/           # Server Golang
├── frontend/          # App React con TypeScript
├── Bible/             # File JSON dei capitoli biblici
│   └── galatians/
│       └── 1/
│           └── eng.json
├── docker-compose.yml # Configurazione Docker
└── README.md
```

## Struttura dei File JSON

I file JSON devono essere organizzati come segue:
- `Bible/{libro}/{capitolo}/{lingua}.json`

Esempio: `Bible/galatians/1/eng.json`

Formato del file JSON:
```json
{
  "book": "Galatians",
  "chapter": 1,
  "language": "eng",
  "verses": [
    {
      "verse": 1,
      "text": "Testo del versetto..."
    }
  ]
}
```

## Come Eseguire l'App

### Con Docker (Raccomandato)

1. Assicurati di avere Docker e Docker Compose installati
2. Dalla cartella root del progetto, esegui:

```bash
docker-compose up --build
```

3. L'app sarà disponibile su:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Sviluppo Locale

#### Backend
```bash
cd backend
go mod tidy
go run main.go
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/books` - Lista tutti i libri disponibili
- `GET /api/chapters/{book}` - Lista i capitoli di un libro
- `GET /api/chapter/{book}/{chapter}?lang=eng` - Ottieni un capitolo specifico
- `GET /api/health` - Health check

## Percorsi Frontend

- `/` - Pagina home per selezionare libro e capitolo
- `/{book}/{chapter}` - Lettura del capitolo (es. `/galatians/1`)

## Tecnologie Utilizzate

- **Backend**: Golang (server HTTP nativo), SQLite
- **Frontend**: React, TypeScript, Tailwind CSS, React Router DOM
- **Build**: Vite
- **Containerizzazione**: Docker, Docker Compose

## Note

- Il database SQLite è configurato come singleton ma non viene ancora utilizzato
- I file JSON devono essere aggiunti manualmente nella cartella `Bible/`
- L'app supporta più lingue tramite il parametro `lang` (default: eng)
# benannah
