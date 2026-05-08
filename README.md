# 🗓️ Turni Facili

**Simple and effective shift management for pharmacies and small businesses**

A cross-platform mobile application (iOS, Android, Web) to manage work shifts, employees, and companies intuitively.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [MVP Roadmap](#-mvp-roadmap)
- [Contributing](#-contributing)

---

## ✨ Features

### Currently Implemented
- ✅ Company management (CRUD)
- ✅ Employee management (CRUD)
- ✅ Mobile interface with tab navigation
- ✅ REST API backend with MongoDB
- ✅ Structured logging

### In Development (MVP)
- 🔄 Authentication system (JWT)
- 🔄 User roles (Admin/Employee)
- 🔄 Shift calendar
- 🔄 Event/shift management

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - NoSQL Database
- **Winston** - Logging
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React Native** 0.76.7 - Mobile framework
- **Expo** 52.0.37 - Development platform
- **React Navigation** - Navigation
- **Ionicons** - Icons

### Database
- **MongoDB Atlas** - Cloud database

---

## 📦 Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Included with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** (optional) - `npm install -g expo-cli`

### For mobile development:
- **Android Studio** (for Android emulator) - [Download](https://developer.android.com/studio)
- **Xcode** (for iOS simulator, macOS only) - [Download](https://developer.apple.com/xcode/)
- **Expo Go** app on your smartphone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sasadangelo/turni-facili.git
cd turni-facili
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
# or
yarn install
```

#### Frontend
```bash
cd frontend
npm install
# or
yarn install
```

#### Root (optional, if you want to use global scripts)
```bash
cd ..
npm install
# or
yarn install
```

---

## 🏃 Running Locally

### Option 1: Manual Start (Recommended for development)

#### 1. Start the Backend

Open a terminal in the `backend` folder:

```bash
cd backend
node server.js
```

You should see:
```
🚀 Server is running on http://localhost:5000
✅ Connected to MongoDB
```

**Note:** The backend connects to MongoDB Atlas. Credentials are currently hardcoded in `server.js` (needs improvement for production).

#### 2. Start the Frontend

Open a **new terminal** in the `frontend` folder:

```bash
cd frontend
npm start
# or
yarn start
# or
npx expo start
```

You'll see the Expo menu:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

#### 3. Open the App

Choose one of the options:

**A. On Physical Smartphone (Easiest)**
1. Install **Expo Go** on your smartphone
2. Scan the QR code shown in the terminal
3. The app will open automatically

**B. On Android Emulator**
1. Start Android Studio and the emulator
2. Press `a` in the Expo terminal
3. The app will install on the emulator

**C. On iOS Simulator (macOS only)**
1. Press `i` in the Expo terminal
2. The simulator will open automatically

**D. On Web Browser**
1. Press `w` in the Expo terminal
2. The app will open in the browser (limited functionality)

---

### Option 2: Script Start (From root)

If you installed dependencies in the root:

```bash
# Start backend
npm run start

# In another terminal, start frontend
cd frontend && npm start
```

---

## 📁 Project Structure

```
turni-facili/
├── backend/                    # Node.js + Express Backend
│   ├── models/                 # Mongoose Models
│   │   ├── Company.js          # Company Model
│   │   ├── Employee.js         # Employee Model
│   │   ├── Event.js            # Event/Shift Model
│   │   └── EventType.js        # Event Type Model
│   ├── routes/                 # API Routes
│   │   ├── companies.js        # Companies CRUD
│   │   ├── employees.js        # Employees CRUD
│   │   ├── events.js           # Events CRUD
│   │   └── eventtypes.js       # Event Types CRUD
│   ├── services/               # Business Logic
│   │   ├── companyService.js
│   │   └── employeeService.js
│   ├── utils/                  # Utilities
│   │   └── logger.js           # Winston Logger
│   ├── server.js               # Entry point
│   └── package.json
│
├── frontend/                   # React Native + Expo Frontend
│   ├── screens/                # App Screens
│   │   ├── CompaniesListScreen.js
│   │   ├── AddCompanyScreen.js
│   │   ├── EditCompanyScreen.js
│   │   ├── EmployeeListScreen.js
│   │   ├── AddEmployeeScreen.js
│   │   └── EditEmployeeScreen.js
│   ├── assets/                 # Images, icons, fonts
│   ├── App.js                  # Entry point + Navigation
│   ├── app.json                # Expo Configuration
│   └── package.json
│
├── test/                       # Test Scripts
│   └── backend/
│       ├── test_companies.sh
│       ├── test_employee.sh
│       └── test_eventtypes.sh
│
├── MVP_PLAN.md                 # Detailed MVP Plan
├── DEPLOYMENT_CHECKLIST.md     # Deployment Checklist
├── TECH_STACK_ANALYSIS.md      # Tech Stack Analysis
└── README.md                   # This file
```

---

## 🔌 API Endpoints

The backend exposes the following REST APIs:

### Companies
```
GET    /companies          # List all companies
GET    /companies/:id      # Company details
POST   /companies          # Create new company
PUT    /companies/:id      # Update company
DELETE /companies/:id      # Delete company
```

### Employees
```
GET    /employees?companyId=X  # List employees by company
GET    /employees/:id          # Employee details
POST   /employees              # Create new employee
PUT    /employees/:id          # Update employee
DELETE /employees/:id          # Delete employee
```

### Events (Events/Shifts)
```
GET    /events             # List events
POST   /events             # Create new event
PUT    /events/:id         # Update event
DELETE /events/:id         # Delete event
```

### Event Types
```
GET    /eventtypes         # List event types
POST   /eventtypes         # Create new type
PUT    /eventtypes/:id     # Update type
DELETE /eventtypes/:id     # Delete type
```

**Base URL:** `http://localhost:5000`

---

## 🧪 Testing

### Backend Testing (with curl)

In the `test/backend/` folder you'll find bash scripts to test the APIs:

```bash
# Test Companies API
cd test/backend
bash test_companies.sh

# Test Employees API
bash test_employee.sh

# Test Event Types API
bash test_eventtypes.sh
```

### Manual Testing

You can use **Postman**, **Insomnia** or **curl**:

```bash
# Create a new company
curl -X POST http://localhost:5000/companies \
  -H "Content-Type: application/json" \
  -d '{"name": "Central Pharmacy"}'

# List companies
curl http://localhost:5000/companies

# Create an employee
curl -X POST http://localhost:5000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "role": "Pharmacist",
    "workingHours": "9-17",
    "company": "COMPANY_ID_HERE"
  }'
```

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
**Problem:** `Error connecting to MongoDB`

**Solution:**
1. Check internet connection
2. Verify MongoDB credentials in `server.js` are correct
3. Ensure your IP is whitelisted in MongoDB Atlas

### Frontend won't connect to Backend
**Problem:** `Failed to fetch` or `Network request failed`

**Solution:**
1. Verify backend is running on `http://localhost:5000`
2. If using physical smartphone, change `localhost` to your computer's IP:
   ```javascript
   // In frontend/screens/*.js
   const response = await fetch('http://192.168.1.X:5000/companies');
   ```
3. Find your local IP:
   - **macOS/Linux:** `ifconfig | grep inet`
   - **Windows:** `ipconfig`

### Expo won't start
**Problem:** `Command not found: expo`

**Solution:**
```bash
npm install -g expo-cli
# or use npx
npx expo start
```

### Port 5000 already in use
**Problem:** `Port 5000 is already in use`

**Solution:**
1. Change port in `backend/server.js`:
   ```javascript
   const port = 5001; // Change here
   ```
2. Update URLs in frontend

---

## 🗺️ MVP Roadmap

See [MVP_PLAN.md](./MVP_PLAN.md) for the detailed plan.

### Next Features (In priority order)
1. **JWT Authentication** - Login/Register
2. **User Roles** - Admin vs Employee
3. **Shift Calendar** - UI to manage shifts
4. **Deployment** - Google Play Store publication

### Estimated Timeline
- **Phase 1A:** Authentication (2-3 days)
- **Phase 1B:** Role-based UI (1-2 days)
- **Phase 1C:** Shift calendar (4-5 days)
- **Phase 1D:** Testing & Polish (2-3 days)
- **Phase 1E:** Deployment (2-3 days)

**Total:** 11-16 days of full-time work

---

## 📚 Additional Documentation

- [MVP Plan](./MVP_PLAN.md) - Complete MVP plan
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Deployment guide
- [Tech Stack Analysis](./TECH_STACK_ANALYSIS.md) - Tech stack analysis

---

## 🤝 Contributing

This is an active development project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Development Notes

### Current Configuration
- **Backend:** `http://localhost:5000`
- **Frontend:** Expo Dev Server (dynamic port)
- **Database:** MongoDB Atlas (cloud)

### Credentials (TO CHANGE IN PRODUCTION!)
⚠️ **IMPORTANT:** MongoDB credentials are currently hardcoded in `backend/server.js`. Before production deployment:
1. Create a `.env` file
2. Move credentials there
3. Add `.env` to `.gitignore`
4. Use `dotenv` to load variables

Example `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=5000
JWT_SECRET=your-secret-key
```

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 👤 Author

**Salvatore D'Angelo**
- GitHub: [@sasadangelo](https://github.com/sasadangelo)

---

## 🙏 Acknowledgments

- React Native Community
- Expo Team
- MongoDB Atlas
- All open source contributors

---

## 📞 Support

For questions or issues:
1. Open an [Issue](https://github.com/sasadangelo/turni-facili/issues)
2. Check the [documentation](./MVP_PLAN.md)
3. Contact the author

---

**Happy coding! 🚀**
