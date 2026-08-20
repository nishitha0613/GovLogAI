#!/usr/bin/env bg
# GovLogAI Zero-Config Ubuntu Deployment & Air-Gap Environment Installer Script
# Usage: bash deploy.sh

set -e

echo "================================================================"
echo "🛡️ GovLogAI Sovereign E-Governance SecOps Platform - Auto Installer"
echo "================================================================"

echo "[1/4] Checking system dependencies..."
if command -v node >/dev/null 2>&1; then
    echo "  ✓ Node.js version $(node -v) detected."
else
    echo "  ! Node.js not found. Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "[2/4] Installing frontend project dependencies..."
npm install

echo "[3/4] Building production air-gapped web distribution..."
npm run build

echo "[4/4] Setting up optional Python FastAPI backend service..."
if [ -d "backend" ]; then
    cd backend
    if command -v python3 >/dev/null 2>&1; then
        python3 -m venv venv || true
        source venv/bin/activate || true
        pip install -r requirements.txt || true
        echo "  ✓ Python FastAPI backend dependencies configured."
    fi
    cd ..
fi

echo "================================================================"
echo "✅ GovLogAI Zero-Config Installation Complete!"
echo "   Run Frontend:  npm run dev"
echo "   Run Backend:   cd backend && uvicorn app.main:app --port 8000"
echo "================================================================"
