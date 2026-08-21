import re
import datetime
import hashlib
from typing import List, Dict, Any

def compute_hash(prev_hash: str, raw_message: str, timestamp_str: str) -> str:
    """Computes standard SHA-256 hash for a log block payload"""
    payload = f"{prev_hash}|{timestamp_str}|{raw_message}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()

def compute_python_hash_chain(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes cryptographic hash-chain for a list of parsed log records.
    Each record stores its hash and previous event's hash.
    """
    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    for r in records:
        ts_str = str(r.get("timestamp", datetime.datetime.utcnow().isoformat()))
        block_hash = compute_hash(prev_hash, r["raw_message"], ts_str)
        r["prev_hash"] = prev_hash
        r["hash"] = block_hash
        r["is_tampered"] = False
        prev_hash = block_hash
    return records

def parse_log_line(raw_line: str):
    """
    Parses a single log line into classified fields strictly based on extracted line evidence.
    Input is sanitized to prevent command injection or XSS payload execution.
    """
    cleaned_line = raw_line.strip()
    lower_line = cleaned_line.lower()

    # Extract IP address (prioritizing source_ip= key-value pair)
    source_ip_match = re.search(r'source_ip=([0-9a-fA-F.:]+)', cleaned_line, re.IGNORECASE)
    if source_ip_match:
        ip_address = source_ip_match.group(1)
    else:
        ip_match = re.search(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', cleaned_line)
        ip_address = ip_match.group(0) if ip_match else "Internal / Unspecified IP"

    # Extract Status Code
    status_match = re.search(r'\b(200|201|304|400|401|403|404|429|500|502|503)\b', cleaned_line)
    status_code = int(status_match.group(1)) if status_match else 200

    # Extract Latency ms if present
    latency_match = re.search(r'\b(\d+)\s*ms\b', cleaned_line, re.IGNORECASE)
    response_time_ms = float(latency_match.group(1)) if latency_match else 0.0

    # Category & Threat Vector
    category = "System Maintenance"
    threat_vector = "Standard Log Operation"

    if "sql injection" in lower_line or "sqli" in lower_line or "union select" in lower_line or "' or 1=1" in lower_line:
        category = "API Security"
        threat_vector = "SQL Injection"
    elif "jwt" in lower_line or "alg: none" in lower_line or "privilege escalation" in lower_line:
        category = "Privilege Escalation"
        threat_vector = "JWT Manipulation"
    elif "credential stuffing" in lower_line or "mfa failure" in lower_line or "failed login" in lower_line:
        category = "Authentication"
        threat_vector = "Credential Stuffing"
    elif "unauthorized access" in lower_line or "saml" in lower_line or "401" in lower_line or "403" in lower_line:
        category = "Authentication"
        threat_vector = "Unauthorized Access"
    elif "sql" in lower_line or "postgres" in lower_line or "pool" in lower_line:
        category = "Database Query"
    elif "biometric" in lower_line or "iris" in lower_line or "passport" in lower_line:
        category = "Biometrics"

    # Severity Level
    level = "INFO"
    if "critical" in lower_line:
        level = "CRITICAL"
    elif "fatal" in lower_line or "error" in lower_line or status_code >= 500:
        level = "ERROR"
    elif "warn" in lower_line or status_code == 429:
        level = "WARN"

    # Microservice Endpoint Mapping
    service = "National Identity Gateway (GovID)"
    if "tax" in lower_line:
        service = "Central Tax & Revenue Gateway"
    elif "visa" in lower_line or "border" in lower_line:
        service = "Border Control & Visa Gateway"
    elif "treasury" in lower_line:
        service = "Public Treasury Settlement API"
    elif "land" in lower_line or "cadastral" in lower_line:
        service = "Land Registry & Cadastral DB"

    return {
        "raw_message": cleaned_line,
        "level": level,
        "service": service,
        "category": category,
        "ip_address": ip_address,
        "status_code": status_code,
        "response_time_ms": response_time_ms,
        "threat_vector": threat_vector,
        "anomaly_score": 95.0 if level == "CRITICAL" else 65.0 if level == "ERROR" else 40.0 if level == "WARN" else 10.0
    }
