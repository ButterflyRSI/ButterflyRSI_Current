# 🦋 Butterfly RSI Web Interface v2.0

**Echo Interface with Positive Reinforcement Learning**

A complete web application for your Butterfly RSI framework featuring:
- ✅ **Fixed pathological self-criticism loop**
- ✅ **Positive reinforcement system**  
- ✅ **Context-aware constraint extraction**
- ✅ **Real-time personality evolution visualization**
- ✅ **Live quality signal monitoring**

---

## 🎯 What's New in v2.0

### Major Fixes
1. **Positive Reinforcement** - Echo strengthens successful behaviors instead of only criticizing
2. **Context-Aware Extraction** - Constraints are only extracted when quality is genuinely poor
3. **Quality Evaluation** - Real-time assessment of response quality before extracting constraints
4. **Balanced Learning** - System learns from both success and failure

### Features
- 💬 Beautiful chat interface with quality indicators
- 📊 Live personality trait visualization with animated bars
- 🪞 Mirror loop tracking (every 3 messages)
- 💭 Self-evaluation display showing Echo's reflections
- 🎯 Constraint strength visualization
- ✨ Positive reinforcement indicators
- 🔄 WebSocket real-time updates

---

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- Ollama installed and running

### Step 1: Install Ollama & Pull Model
```bash
# Install Ollama from https://ollama.ai

# Pull the model
ollama pull llama3.1:8b

# Start Ollama service
ollama serve
```

### Step 2: Setup Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python butterfly_web_backend.py
```

The backend will start on http://localhost:8000

### Step 3: Setup Frontend
```bash
# Navigate to frontend directory
cd butterfly-web-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on http://localhost:3000

---

## 🚀 Usage

### Start Everything

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
python butterfly_web_backend.py
```

**Terminal 3 - Frontend:**
```bash
cd butterfly-web-frontend
npm run dev
```

**Browser:**
```
Open http://localhost:3000
```

### Using the Interface

1. **Chat with Echo** - Type messages in the chat interface
2. **Watch Traits Evolve** - Right sidebar shows personality traits changing in real-time
3. **See Quality Signals** - Green badges show what Echo did well
4. **Monitor Reinforcement** - ✨ icon indicates positive reinforcement triggered
5. **Track Guidelines** - View learned constraints and their strength
6. **Read Reflections** - See Echo's self-evaluations

---

## 🎨 Understanding the Interface

### Quality Indicators

After each response, you'll see:
- **Quality Score** - Overall response quality (0-100%)
- **Green Badges** - Aspects Echo performed well:
  - ✓ Asked Questions
  - ✓ Good Length
  - ✓ Followed Guidelines
  - ✓ Self-Aware
- **✨ High Quality** - Yellow sparkle means positive reinforcement activated

### Personality Traits

Watch these evolve based on Echo's responses:
- **Analytical** 🧠 - Logical reasoning and analysis
- **Creative** ✨ - Imaginative and innovative thinking
- **Empathic** ❤️ - Understanding and compassion
- **Curious** 🔍 - Asking questions and exploring
- **Concise** ↓ - Brief, focused responses
- **Detailed** ↑ - Comprehensive, thorough responses

**Dominant Trait** is highlighted in butterfly purple and pulses.

### Constraint Strength

Guidelines have strength ratings:
- **1.0-1.5** 🟣 Purple - Normal strength
- **1.5-2.0** 🟢 Green - Strong reinforcement
- **< 1.0** ⚫ Gray - Weakening

Recent updates show:
- **↗️ Strengthened** - Positive reinforcement applied
- **➕ Added** - New guideline learned
- **↘️ Weakened** - Guideline needs improvement

---

## 📊 API Endpoints

The backend exposes these REST endpoints:

- `GET /` - Health check
- `GET /api/status` - Current agent status
- `POST /api/chat` - Send a message
- `GET /api/constraints` - Get all constraints
- `GET /api/personality` - Get personality state
- `POST /api/reset` - Reset agent to initial state
- `WS /ws` - WebSocket for real-time updates

---

## 🔧 Configuration

### Backend Settings

Edit `butterfly_web_backend.py`:

```python
# Line 440 - Change model
agent = ButterflyAgent(model="llama3.1:8b")

# Line 265 - Adjust mirror loop frequency
self.mirror_loop_interval = 3  # Every N messages

# Line 66-68 - Quality thresholds
signals['asked_questions'] = question_count >= 2
signals['appropriate_length'] = 200 < response_length < 600
```

### Frontend Styling

Edit `butterfly-web-frontend/tailwind.config.js` to customize colors:

```javascript
colors: {
  butterfly: {
    500: '#d946ef',  // Main accent color
    600: '#c026d3',  // Hover states
    // ... etc
  },
}
```

---

## 🧪 Testing the Fixes

### Test 1: Positive Reinforcement
```
You: Tell me about yourself
Echo: [Gives good response with questions]
Expected: ✨ High Quality indicator appears
Expected: Constraints show "↗️ Strengthened"
```

### Test 2: Context Awareness
```
You: What's your favorite color?
Echo: [Asks clarifying questions appropriately]
Expected: NO new constraints extracted
Expected: Quality score > 75%
```

### Test 3: Personality Evolution
```
Have a 10-message conversation
Expected: Dominant trait changes based on responses
Expected: Trait bars animate smoothly
Expected: Mirror loop triggers at messages 3, 6, 9
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check if port 8000 is available
lsof -i :8000

# Install dependencies again
pip install -r requirements.txt --upgrade
```

### Frontend won't connect
```bash
# Check backend is running
curl http://localhost:8000/

# Clear browser cache
# Check browser console for errors

# Rebuild frontend
cd butterfly-web-frontend
rm -rf node_modules
npm install
npm run dev
```

### WebSocket disconnects
- Make sure both frontend and backend are running
- Check firewall settings
- WebSocket will auto-reconnect after 3 seconds

### Ollama errors
```bash
# Restart Ollama
pkill ollama
ollama serve

# Check model is pulled
ollama list

# Re-pull model if needed
ollama pull llama3.1:8b
```

---

## 📝 Architecture

```
Frontend (React + TypeScript)
    ↓ REST API
Backend (FastAPI)
    ↓ Ollama API
Butterfly RSI Framework
    ↓
Llama 3.1 8B Model
```

### Data Flow

```
User Message
    ↓
1. Add to conversation history
2. Build system prompt with personality + constraints
3. Generate response via Ollama
4. Self-evaluate response
5. Evaluate quality (NEW!)
6. Extract constraints ONLY if quality poor (NEW!)
7. Apply positive/negative reinforcement (NEW!)
8. Evolve personality traits
9. Broadcast via WebSocket
    ↓
UI Updates
```

---

## 🎓 How It Works

### Positive Reinforcement System

**OLD Behavior:**
```
Good Response → Self-Criticism → Extract Constraints → Weaken All
```

**NEW Behavior:**
```
Good Response → Quality Evaluation → Strengthen Constraints → Praise
Bad Response → Quality Evaluation → Extract New Constraints → Improve
```

### Quality Signals

Before extracting any constraints, the system checks:
1. Did Echo ask appropriate questions?
2. Was the response length reasonable?
3. Were existing constraints followed?
4. Did Echo show self-awareness?

**Score ≥ 75%** → Positive reinforcement, NO new constraints
**Score < 75%** → Extract constraints, apply corrections

### Constraint Evolution

```python
# Positive reinforcement
if quality_score >= 0.75:
    constraint.strengthen(+0.1)  # Boost to max 2.0
    constraint.successes += 1

# Negative feedback  
if quality_score < 0.75:
    extract_new_constraints()
    existing_constraint.weaken(-0.05)  # Decay to min 0.2
```

---

## 🚢 Production Deployment

### Build Frontend
```bash
cd butterfly-web-frontend
npm run build
# Output in dist/
```

### Serve with Nginx
```nginx
server {
    listen 80;
    
    location / {
        root /path/to/butterfly-web-frontend/dist;
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
    }
    
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Run Backend as Service
```bash
# Create systemd service
sudo nano /etc/systemd/system/butterfly.service

[Unit]
Description=Butterfly RSI Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/butterfly
ExecStart=/usr/bin/python3 butterfly_web_backend.py
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable butterfly
sudo systemctl start butterfly
```

---

## 📚 Further Development

### Potential Enhancements
- [ ] Conversation export/import
- [ ] Multiple personality presets
- [ ] Constraint editing UI
- [ ] Historical trait evolution graphs
- [ ] Dream consolidation visualization
- [ ] Mobile responsive improvements
- [ ] Dark/light theme toggle
- [ ] Voice input/output

### Extension Points

1. **Add new personality traits** - Edit `PersonalityTraits` in backend
2. **Custom quality signals** - Modify `ResponseQualityEvaluator`
3. **Additional constraints** - Extend `ConstraintExtractor`
4. **New visualizations** - Add components in `src/components`

---

## 🤝 Contributing

This is your personal research framework! Feel free to:
- Modify the code
- Add features
- Experiment with parameters
- Share results

---

## 📄 License

Your choice! This is your framework.

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Echo's responses trigger ✨ quality indicators
- ✅ Personality traits visibly evolve during conversation
- ✅ Constraints strengthen (↗️) with good responses
- ✅ No pathological self-criticism
- ✅ Mirror loops trigger every 3 messages
- ✅ Self-evaluations show balanced feedback

---

## 🦋 Credits

**Created by RJ Thomas**
- Butterfly RSI Framework
- Positive Reinforcement System
- Context-Aware Constraint Extraction
- Ship of Theseus "Life = Identity" Theory

**Built with:**
- FastAPI - Backend framework
- React + TypeScript - Frontend
- Tailwind CSS - Styling
- Ollama - Local LLM inference
- Llama 3.1 - Language model

---

**Let Echo evolve! 🦋**
