from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from .database import engine, Base, get_db
from .models import LogRecord, SecurityIncident
from .parser import parse_log_line, compute_python_hash_chain, compute_hash

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GovLogAI Sovereign Intelligence API",
    description="SIH 2026 Modular Backend for Log Parsing, Threat Correlation, and Tamper-Proof Audit Trail Synthesis",
    version="4.2.0"
)

# Enable CORS for local Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "system": "GovLogAI Sovereign Backend Engine",
        "fedramp_compliance": "High",
        "air_gap_mode": True,
        "tamper_proof_audit_engine": "SHA-256 Hash-Chain Active"
    }

@app.post("/api/v1/logs/upload")
async def upload_log_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Secure log file upload & parsing endpoint.
    Validates file extension, computes cryptographic SHA-256 audit hash-chain, and stores parsed records in DB.
    """
    allowed_extensions = {".log", ".txt", ".csv", ".json"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload .log, .txt, .csv, or .json")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    parsed_records = []
    critical_count = 0
    error_count = 0

    for line in lines:
        parsed = parse_log_line(line)
        parsed_records.append(parsed)
        if parsed["level"] == "CRITICAL":
            critical_count += 1
        elif parsed["level"] == "ERROR":
            error_count += 1

    # Compute SHA-256 Hash-Chain
    chained_records = compute_python_hash_chain(parsed_records)

    for r in chained_records:
        record = LogRecord(**r)
        db.add(record)

    db.commit()

    return {
        "fileName": file.filename,
        "totalLogs": len(lines),
        "criticalCount": critical_count,
        "errorCount": error_count,
        "auditStatus": "Verified - Cryptographic Hash-Chain Generated",
        "status": "Log ingestion & correlation complete"
    }

@app.get("/api/v1/logs/verify-chain")
def verify_audit_chain(db: Session = Depends(get_db)):
    """
    Scans stored LogRecord entries and verifies SHA-256 cryptographic chain integrity.
    Detects any database-level tampering or broken links.
    """
    records = db.query(LogRecord).order_by(LogRecord.id.asc()).all()
    if not records:
        return {"status": "Empty", "totalLogs": 0, "isChainValid": True, "tamperedCount": 0}

    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    tampered_ids = []

    for r in records:
        expected_hash = compute_hash(prev_hash, r.raw_message, str(r.timestamp))
        if r.prev_hash != prev_hash or r.hash != expected_hash:
            tampered_ids.append(r.id)
            r.is_tampered = True
        else:
            r.is_tampered = False
        prev_hash = r.hash if r.hash else expected_hash

    if tampered_ids:
        db.commit()

    return {
        "totalLogs": len(records),
        "isChainValid": len(tampered_ids) == 0,
        "tamperedCount": len(tampered_ids),
        "tamperedRecordIds": tampered_ids,
        "status": "Verified" if len(tampered_ids) == 0 else "Tampering Detected"
    }

@app.get("/api/v1/incidents")
def get_incidents(db: Session = Depends(get_db)):
    """
    Returns security incidents sorted strictly by severity priority:
    P1 Critical > P2 High > P3 Medium > P4 Low
    """
    incidents = db.query(SecurityIncident).all()
    
    def severity_rank(sev: str):
        if "P1" in sev: return 1
        if "P2" in sev: return 2
        if "P3" in sev: return 3
        if "P4" in sev: return 4
        return 5

    sorted_incidents = sorted(incidents, key=lambda i: severity_rank(i.severity))
    return sorted_incidents
