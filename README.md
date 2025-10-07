# 🌍 Carbon Footprint Logger

**Carbon Footprint Logger** is a full-stack web application that helps users understand, track, and reduce their daily CO₂ emissions.
It allows users to log activities (like travel, diet, or energy use), view detailed emission analytics, set weekly goals, and receive smart AI-driven insights to improve their carbon habits.



🔗 Live App: https://carbon-footprint-frontend-4nzs.onrender.com



# 🧠 Features
### 🧾 Activity Tracking
- Log activities (food, travel, energy use, etc.)
- Automatic CO₂ calculation for each activity
- Filter and view emissions by category

### 📊 Data Visualization
- Visual summary of total emissions (bar/pie chart)
- Insights into which category contributes most to emissions

### 👤 User Accounts
- Secure authentication system (signup/login)
- Personalized dashboard for each user

### 💡 Weekly Insight Engine
- Analyzes user activity each login or weekly
- Identifies top emission category
- Generates personalized suggestions (e.g., “Try cycling twice this week to cut 2 kg CO₂”)
- Tracks weekly reduction targets

### ⚡ Real-Time Tips (WebSockets)
- Smart insights are pushed to users instantly without page reload
- Weekly goal section updates live based on new activity entries

# 🧱 Tech Stack
### Frontend
- HTML5
- CSS3 (Responsive design & layout)
- JavaScript (Vanilla JS + DOM manipulation)
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO (for live updates)

### Dev Tools
- Postman (API testing)
- Git & GitHub (version control)
- dotenv (environment variables)

# 🗂️ Project Structure
```
carbon-footprint-logger/
│
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   └── activities.js
│   ├── models/
│   │   └── Activity.js
│   ├── utils/
│   │   └── insights.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── websocket.js
│   │   └── insights.js
│   └── Images/
│
├── README.md
└── package.json
```

# ⚙️ Setup Instructions
1️⃣ Clone the repository
```
git clone https://github.com/yourusername/carbon-footprint-logger.git
cd carbon-footprint-logger
```

2️⃣ Install dependencies
```npm install```

3️⃣ Set up environment variables

Create a .env file inside the backend/ folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

4️⃣ Start the backend server
```npm start```

5️⃣ Open the frontend
- Simply open index.html in your browser or serve it using Live Server.

# 🧩 Future Improvements

- [ ] Add AI-driven emission recommendations
- [ ] Enable OAuth (Google / GitHub login)
- [ ] Add progress tracking and badges
- [ ] Mobile app version

# 👥 Author

Dikson Manganye
💻 Full-Stack Developer
https://diksonivyson.github.io/My_Portfolio/

🔗 LinkedIn : https://www.linkedin.com/in/dikson-manganye-a8b773213/
