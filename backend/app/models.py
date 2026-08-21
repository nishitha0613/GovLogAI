from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean
import datetime
from .database import Base

class LogRecord(Base):
    __tablename__ = "log_records"

    id = Column(Integer, primary_key=True, index=True)
    raw_message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    level = Column(String, index=True)
    service = Column(String, index=True)
    category = Column(String, index=True)
    ip_address = Column(String, default="Internal / Unspecified IP")
    status_code = Column(Integer, default=200)
    response_time_ms = Column(Float, default=0.0)
    threat_vector = Column(String, default="Standard Log Operation")
    anomaly_score = Column(Float, default=0.0)
    hash = Column(String, index=True, nullable=True)
    prev_hash = Column(String, index=True, nullable=True)
    is_tampered = Column(Boolean, default=False)

class SecurityIncident(Base):
    __tablename__ = "security_incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    severity = Column(String, index=True) # P1 Critical > P2 High > P3 Medium > P4 Low
    affected_service = Column(String, index=True)
    occurrences = Column(Integer, default=1)
    status = Column(String, default="Active")
    threat_actor_ip = Column(String, default="Internal / Unspecified IP")
    ai_root_cause = Column(Text, nullable=True)
    mitigation_playbook = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
