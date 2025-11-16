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
