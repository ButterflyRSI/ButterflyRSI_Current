#!/bin/bash

# 🦋 Butterfly RSI Web Interface - Automated Setup Script
# This script sets up the complete environment for running Butterfly RSI v2.0

set -e  # Exit on any error

echo "🦋 Butterfly RSI Web Interface v2.0 - Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Ollama is installed
echo "📡 Checking for Ollama..."
if ! command -v ollama &> /dev/null; then
    echo -e "${RED}❌ Ollama is not installed${NC}"
    echo "Please install Ollama from https://ollama.ai"
    echo "Then run this script again."
    exit 1
else
    echo -e "${GREEN}✓ Ollama found${NC}"
fi

# Check if Ollama is running
echo "📡 Checking if Ollama is running..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ollama is running${NC}"
else
    echo -e "${YELLOW}⚠ Ollama is not running${NC}"
    echo "Starting Ollama service..."
    ollama serve &
    OLLAMA_PID=$!
    sleep 3
    echo -e "${GREEN}✓ Ollama started (PID: $OLLAMA_PID)${NC}"
fi

# Check if model is pulled
echo "🤖 Checking for llama3.1:8b model..."
if ollama list | grep -q "llama3.1:8b"; then
    echo -e "${GREEN}✓ Model already downloaded${NC}"
else
    echo -e "${YELLOW}⚠ Downloading llama3.1:8b (this may take a while)...${NC}"
    ollama pull llama3.1:8b
    echo -e "${GREEN}✓ Model downloaded${NC}"
fi

# Setup Python backend
echo ""
echo "🐍 Setting up Python backend..."

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 8 ]); then
    echo -e "${RED}❌ Python 3.8+ required (found $PYTHON_VERSION)${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Python $PYTHON_VERSION${NC}"
fi

# Create virtual environment (optional but recommended)
echo "Creating Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${YELLOW}⚠ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Python dependencies installed${NC}"

# Setup Node.js frontend
echo ""
echo "⚛️  Setting up React frontend..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required (found v$NODE_VERSION)${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Node.js v$NODE_VERSION${NC}"
fi

# Navigate to frontend directory
cd butterfly-web-frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install --silent
echo -e "${GREEN}✓ Node dependencies installed${NC}"

cd ..

# Create startup scripts
echo ""
echo "📝 Creating startup scripts..."

# Backend startup script
cat > start_backend.sh << 'EOF'
#!/bin/bash
echo "🐍 Starting Butterfly RSI Backend..."
source venv/bin/activate
python butterfly_web_backend.py
EOF
chmod +x start_backend.sh
echo -e "${GREEN}✓ Created start_backend.sh${NC}"

# Frontend startup script  
cat > start_frontend.sh << 'EOF'
#!/bin/bash
echo "⚛️  Starting Butterfly RSI Frontend..."
cd butterfly-web-frontend
npm run dev
EOF
chmod +x start_frontend.sh
echo -e "${GREEN}✓ Created start_frontend.sh${NC}"

# All-in-one startup script (tmux)
cat > start_all.sh << 'EOF'
#!/bin/bash
echo "🦋 Starting Butterfly RSI - All Services"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "⚠️  tmux not found. Starting services in separate terminals..."
    echo "To use the all-in-one startup, install tmux: sudo apt install tmux"
    echo ""
    echo "For now, run these commands in separate terminals:"
    echo "  Terminal 1: ./start_backend.sh"
    echo "  Terminal 2: ./start_frontend.sh"
    exit 1
fi

# Create tmux session
tmux new-session -d -s butterfly

# Backend window
tmux rename-window -t butterfly:0 'backend'
tmux send-keys -t butterfly:0 './start_backend.sh' C-m

# Frontend window
tmux new-window -t butterfly:1 -n 'frontend'
tmux send-keys -t butterfly:1 './start_frontend.sh' C-m

# Attach to session
tmux attach-session -t butterfly
EOF
chmod +x start_all.sh
echo -e "${GREEN}✓ Created start_all.sh${NC}"

# Setup complete
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📚 Quick Start:"
echo ""
echo "  Option 1 - Run everything with tmux:"
echo "    ./start_all.sh"
echo ""
echo "  Option 2 - Run in separate terminals:"
echo "    Terminal 1: ./start_backend.sh"
echo "    Terminal 2: ./start_frontend.sh"
echo ""
echo "  Option 3 - Manual startup:"
echo "    Terminal 1: ollama serve"
echo "    Terminal 2: python butterfly_web_backend.py"
echo "    Terminal 3: cd butterfly-web-frontend && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "=========================================="
echo -e "${GREEN}Happy chatting with Echo! 🦋${NC}"
echo "=========================================="
