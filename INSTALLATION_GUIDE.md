# 📁 Installation Guide - Where to Put Files

## 🎯 Directory Structure

Create a project folder and organize files like this:

```
butterfly-rsi-web/                    
├── butterfly_web_backend.py         
├── requirements.txt                  
├── setup.sh                          
├── README.md                         
├── QUICKSTART.md                     
├── PATHOLOGICAL_LOOP_FIX.md          
├── COMPLETE_PACKAGE.md               
└── butterfly-web-frontend/           
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── index.css
        ├── App.tsx
        ├── types/
        │   └── index.ts
        ├── hooks/
        │   └── useWebSocket.ts
        └── components/
            ├── ChatInterface.tsx
            ├── PersonalityDashboard.tsx
            ├── ConstraintsPanel.tsx
            ├── SelfEvaluationPanel.tsx
            └── StatusBar.tsx
```

## 🚀 Step-by-Step Installation

### Create Project Directory

```bash
# Choose where you want the project (example: your home directory)
cd ~

# Create the project folder
mkdir butterfly-rsi-web
cd butterfly-rsi-web
```



### Make Setup Script Executable

```bash
chmod +x setup.sh
```

### Run Setup

```bash
./setup.sh
```

This will:
- ✅ Check Ollama installation
- ✅ Pull llama3.1:8b model
- ✅ Create Python virtual environment
- ✅ Install all dependencies
- ✅ Create startup scripts

### Step 6: Start Application

```bash
./start_all.sh
```

Or in separate terminals:
```bash
# Terminal 1
./start_backend.sh

# Terminal 2
./start_frontend.sh
```

### Step 7: Open Browser

```
http://localhost:3000
```

---

## 🔍 What Goes Where (Detailed)

### Root Directory (butterfly-rsi-web/)

These files go directly in your main project folder:

| File | Purpose |
|------|---------|
| `butterfly_web_backend.py` | FastAPI backend server |
| `requirements.txt` | Python dependencies list |
| `setup.sh` | Automated setup script |
| `README.md` | Full documentation |
| `QUICKSTART.md` | Quick start guide |
| `PATHOLOGICAL_LOOP_FIX.md` | Technical deep dive |
| `COMPLETE_PACKAGE.md` | File manifest |

### Frontend Directory (butterfly-web-frontend/)

This entire folder structure goes in a subfolder:

```
butterfly-web-frontend/
├── Configuration Files (root of frontend folder)
│   ├── package.json          → npm dependencies
│   ├── vite.config.ts        → Build config
│   ├── tsconfig.json         → TypeScript config
│   ├── tailwind.config.js    → Styling config
│   ├── postcss.config.js     → CSS processing
│   └── index.html            → Entry HTML
│
└── src/ (source code folder)
    ├── Main Files
    │   ├── main.tsx          → React entry point
    │   ├── index.css         → Global styles
    │   └── App.tsx           → Main app component
    │
    ├── types/
    │   └── index.ts          → TypeScript types
    │
    ├── hooks/
    │   └── useWebSocket.ts   → WebSocket hook
    │
    └── components/
        ├── ChatInterface.tsx
        ├── PersonalityDashboard.tsx
        ├── ConstraintsPanel.tsx
        ├── SelfEvaluationPanel.tsx
        └── StatusBar.tsx
```

---


## ✅ Verification Checklist

After organizing files, verify:

- [ ] `butterfly_web_backend.py` exists in root
- [ ] `requirements.txt` exists in root
- [ ] `setup.sh` exists in root and is executable (`chmod +x setup.sh`)
- [ ] `butterfly-web-frontend/` folder exists
- [ ] `butterfly-web-frontend/package.json` exists
- [ ] `butterfly-web-frontend/src/App.tsx` exists
- [ ] `butterfly-web-frontend/src/components/` folder has 5 .tsx files

---

## 🆘 If Something's Missing

If any files are missing or in wrong locations:

1. **Check the outputs folder** - All files are available for download
2. **Re-download missing files** - Click the file links again
3. **Verify paths** - Make sure files are in correct subfolders
4. **Run setup anyway** - It will tell you what's missing

---

## 🚀 After Installation

Once files are in place:

```bash
# Make sure you're in the project directory
cd ~/butterfly-rsi-web/

# Run setup
./setup.sh

# Start the app
./start_all.sh

# Open browser to http://localhost:3000
```

---



**That's it! Download all the files, put them in this structure, run setup.sh, and you're ready to go! 🦋**
