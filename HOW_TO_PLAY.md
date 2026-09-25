# CyberAwareness — Enterprise Project

> A 360-degree first-person cybersecurity training simulation. Built for enterprise-level awareness training against real-world social engineering attacks.

---

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Starting the Game](#starting-the-game)
4. [Creating an Account](#creating-an-account)
5. [The Lobby](#the-lobby)
6. [How to Play](#how-to-play)
7. [Controls](#controls)
8. [Scoring System](#scoring-system)
9. [Levels and Scenarios](#levels-and-scenarios)
10. [History and Stats](#history-and-stats)
11. [Admin Panel](#admin-panel)
12. [Troubleshooting](#troubleshooting)

---

## Requirements

Install the following software once before running the project:

| Software | Version | Download |
|----------|---------|---------|
| Node.js | v18 or higher | https://nodejs.org (click LTS) |
| MongoDB Community | Any recent version | https://www.mongodb.com/try/download/community |
| Web Browser | Chrome, Edge, or Firefox | — |

**Verify Node.js is installed:**

```
node -v
```

Should print a version number such as `v24.0.0`.

---

## Installation

1. Copy the `Enterprise Project` folder to your machine (via USB, Google Drive, or shared folder)
2. Place it anywhere on your system, for example:
   - `C:\Enterprise Project\`
   - `D:\Enterprise Project\`

---

## Starting the Game

### Step 1 — Start MongoDB

MongoDB must be running before the server starts.

If MongoDB is installed as a Windows service it may already be running automatically.
To start it manually, open **PowerShell as Administrator** and run:

```
net start MongoDB
```

Expected output: `The MongoDB service was started successfully.`

---

### Step 2 — Start the Server

Open **PowerShell** and navigate to the server folder:

```
cd "D:\Enterprise Project\server"
```

Install dependencies (first time only):

```
npm install
```

Start the server:

```
node server.js
```

Expected output:

```
MongoDB connected
Server running!
Open in browser: http://localhost:5000
```

> Keep this PowerShell window open while using the platform. Closing it stops the server.

---

### Step 3 — Open in Browser

Navigate to:

```
http://localhost:5000
```

---

## Creating an Account

### New User — Register

1. Click the **Register** tab
2. Enter your **Name**, **Email**, and **Password**
3. Click **Register**
4. You are redirected to the Lobby automatically

### Returning User — Login

1. Click the **Login** tab
2. Enter your **Email** and **Password**
3. Click **Enter training pod**

### Guest / Examiner Mode

Click **Instant Demo Play** on the login screen to access the platform without an account.
Scores are saved locally in the browser only and are not stored in the database.

---

## The Lobby

After logging in, the Lobby appears with the 3D office environment frozen in the background.

| Section | Description |
|---------|-------------|
| START GAME | Enters the 3D office and begins a training session |
| How to Play | Opens a beginner guide modal with instructions |
| Level Progress | Visual map of all 11 levels showing lock and unlock status |
| Your Stats | Total calls, best score, safe streak, and average risk score |
| Top Players | Live leaderboard ranked by best score across all users |
| Security Tip | Rotating cybersecurity awareness tip updated each session |
| History | Dropdown in the nav bar showing your full game history |

---

## How to Play

```
Click START GAME
       |
       v
3D Office loads (360-degree view, freely explorable)
       |
       v
Phone rings after approximately 2 seconds
       |
       v
Click the phone to answer
       |
       v
Select a scenario from the menu (11 available)
       |
       v
Complete 5 conversation stages
Make one decision at each stage
       |
       v
Comprehension Quiz — 3 questions about the attack
       |
       v
After-Action Report with your Risk Score out of 8
       |
       v
Return to Lobby — all stats update automatically
```

---

## Controls

| Key or Action | Effect |
|--------------|--------|
| Click on scene | Locks mouse for first-person camera control |
| W | Walk forward |
| S | Walk backward |
| A | Strafe left |
| D | Strafe right |
| Mouse | Look around 360 degrees |
| Space | Jump |
| ESC | Release mouse cursor |
| History button in HUD | Opens the in-game history panel |

---

## Scoring System

Each incorrect decision adds risk points to your total. Lower scores are better.

| Score | Rating | Meaning |
|-------|--------|---------|
| 0 | Safe | Perfect — no information leaked |
| 1 to 2 | Safe | Excellent defence |
| 3 to 5 | Risky | Some poor decisions were made |
| 6 to 8 | Dangerous | Full security breach |

**Score 5 or less on the current level to unlock the next one.**

### Comprehension Quiz

After each call a 3-question quiz appears before the score report.
Questions are specific to the attack vector in that scenario and test your understanding
of why the attack was dangerous and what the correct response was.

---

## Levels and Scenarios

Levels 1 and 2 are unlocked by default for all users.
Score 5 or less to unlock each subsequent level.

| Level | Character | Attack Type |
|-------|-----------|-------------|
| 1 | Marcus Reed | Credential Theft |
| 2 | Karen Alvarez | Invoice Fraud |
| 3 | CEO J. Whitfield | Executive Impersonation |
| 4 | Sam from Facilities | Building Access |
| 5 | Alex from Talent | Data Harvesting |
| 6 | Cloud Support | Account Takeover |
| 7 | Nina from Payroll | Direct Deposit Fraud |
| 8 | Windows Tech Support | Remote Access Scam |
| 9 | Dave — Site Contractor | Physical Access |
| 10 | HSBC Fraud Team | OTP Theft |
| 11 | CyberSafe Research | Credential Harvesting |

---

## History and Stats

Game history is accessible from two locations:

| Location | How to Access |
|----------|---------------|
| Lobby | Click the History button in the top navigation bar |
| 3D Office | Click the History button in the HUD bar at the top of the screen |

Each entry shows: scenario name, risk score, rating, and date played.
Click **Clear History** to reset your local history log.

**Stats visible in the Lobby:**
- Total calls completed
- Best score achieved
- Current safe streak
- Safe and risky call counts
- Average risk score

---

## Admin Panel

The admin dashboard is accessible at:

```
http://localhost:5000/admin.html
```

| Field | Value |
|-------|-------|
| Email | admin@cyberawareness.local |
| Password | admin123 |

**Admin capabilities:**
- View all registered users and individual scores
- View total attempts, average scores, and rating breakdown per user
- Delete user accounts
- Export full player data as CSV

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Page does not load | Confirm server is running with `node server.js` |
| MongoDB not connected | Run `net start MongoDB` in PowerShell as Administrator |
| Port already in use | Run `taskkill /F /IM node.exe` then restart the server |
| Page looks broken | Press Ctrl + Shift + R to force a hard refresh |
| 3D office does not appear | Click the START GAME button in the lobby |
| Phone is not ringing | Wait 2 to 3 seconds after clicking START GAME |
| Mouse not responding | Click anywhere on the 3D scene to lock the cursor |
| Level not unlocking | Complete previous level with a score of 5 or less |

**To stop the server:**
Press `Ctrl + C` in the PowerShell window, then close the browser tab.

---

*CyberAwareness — Enterprise Project*