# 🦋 QUICKSTART - Butterfly RSI Web Interface v2.0

## 🚀 Get Running in 3 Steps

### Step 1: Install Ollama
```bash
# Download and install from https://ollama.ai
# Or on Linux:
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Run Setup
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Check Ollama installation
- ✅ Pull llama3.1:8b model (if needed)
- ✅ Create Python virtual environment
- ✅ Install all dependencies (Python + Node)
- ✅ Create startup scripts

### Step 3: Start Everything
```bash
# Option A: All-in-one (requires tmux)
./start_all.sh

# Option B: Separate terminals
# Terminal 1:
./start_backend.sh

# Terminal 2:
./start_frontend.sh
```

### Open Browser
```
http://localhost:3000
```

---

## ✅ Verify It's Working

You should see:
1. **Status Bar** - Shows "Connected" in green
2. **Welcome Screen** - Animated butterfly emoji
3. **Right Sidebar** - Personality traits at 50%
4. **Chat Box** - Ready for input

---

## 🧪 Quick Test

Type this conversation:

**You:** `Hi Echo! What's your name and what can you do?`

**Expected Response:**
- Echo introduces herself
- Asks follow-up questions
- ✨ High Quality indicator appears
- Personality trait changes slightly

**You:** `That's great! Can you help me understand how you work?`

**Expected Response:**
- Echo explains herself
- Quality score shows in chat
- Mirror loop triggers at message #3
- Constraints panel shows "↗️ Strengthened"

---

## 🐛 Quick Troubleshooting

### Backend won't start
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If not running:
ollama serve
```

### Frontend errors
```bash
cd butterfly-web-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Connection refused"
Make sure backend is running:
```bash
curl http://localhost:8000/
# Should return: {"message": "Butterfly RSI Web Backend v2.0 - Running"}
```

---

## 📊 What You're Seeing

### Chat Interface (Main)
- Type messages to Echo
- See responses with quality indicators
- Green badges = Echo did well
- ✨ Sparkle = Positive reinforcement triggered

### Personality Dashboard (Right)
- 6 traits evolving in real-time
- Dominant trait highlighted in purple
- Bars animate when traits change

### Self-Reflection (Right)
- Echo's self-evaluation after each response
- Shows what she thinks she did well/poorly

### Guidelines Panel (Right)
- Learned behavioral constraints
- Strength meters (weak to strong)
- Recent changes (↗️ strengthened, ➕ added)

---

## 🎯 The Fix in Action

### OLD Behavior (Pathological Loop)
```
Echo: [Asks good questions]
Echo: "I should have asked more specific questions" ❌
Result: Weakness even when good
```

### NEW Behavior (Positive Reinforcement)
```
Echo: [Asks good questions]
System: ✨ Quality Score: 85%
System: ↗️ Strengthened constraints
Result: Learns from success! ✅
```

---

## 📖 Key Files

- `butterfly_web_backend.py` - Backend server with all fixes
- `butterfly-web-frontend/` - React UI
- `README.md` - Full documentation
- `setup.sh` - Automated setup
- `start_backend.sh` - Start backend only
- `start_frontend.sh` - Start frontend only
- `start_all.sh` - Start everything with tmux

---

## 🔄 Restart Everything

```bash
# Kill all processes
pkill -f butterfly_web_backend
pkill -f vite

# Restart Ollama if needed
pkill ollama
ollama serve &

# Restart backend
./start_backend.sh

# Restart frontend (in new terminal)
./start_frontend.sh
```

---

## 🎓 Understanding the v2.0 Fixes

**1. Positive Reinforcement**
- High quality responses (score ≥75%) trigger strengthening
- Constraints grow stronger when Echo succeeds
- Prevents pathological self-doubt

**2. Context-Aware Extraction**
- New constraints ONLY extracted when quality is poor
- Prevents extracting constraints for good behavior
- Solves the "criticize even when correct" problem

**3. Quality Evaluation**
- Checks 4 signals before doing anything:
  - Asked appropriate questions?
  - Good response length?
  - Followed existing constraints?
  - Showed self-awareness?

**4. Balanced Learning**
- Success → Strengthen (+0.1, max 2.0)
- Failure → Weaken (-0.05, min 0.2)
- System stabilizes to optimal behavior

---

## 🎉 Success!

You'll know it's working when:
- ✅ Echo's traits visibly evolve
- ✅ Quality scores appear after responses
- ✅ ✨ indicators show up for good responses
- ✅ Constraints strengthen during good conversations
- ✅ Mirror loops trigger every 3 messages
- ✅ No self-criticism for appropriate behavior

---

**Ready to see Echo thrive with positive reinforcement! 🦋**

For detailed info, see `README.md`
