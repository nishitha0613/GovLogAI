# GovLogAI Backend Engine (SIH 2026 - Criteria F2 & F6)

Modular FastAPI backend for sovereign e-governance log parsing, threat vector correlation, and SQLite/PostgreSQL storage.

## 🚀 How to Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- **Swagger API Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/v1/health`
- **Log File Ingestion API**: `POST http://localhost:8000/api/v1/logs/upload`

## 🔒 Security Controls (F10)
- **Input Sanitization**: Rejects unauthorized file formats (`.exe`, `.sh`).
- **No Command Execution**: Log lines are parsed strictly as text data — no shell invocation.
- **Configurability**: Accepts `DATABASE_URL` environment variables for instant PostgreSQL / OpenSearch scale-out.
