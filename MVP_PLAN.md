# Turni Facili - MVP Plan for Google Play Store

## 📊 Current State Analysis

### ✅ What You Have
- **Backend (Node.js + Express + MongoDB)**
  - Company management (CRUD)
  - Employee management (CRUD)
  - Event/Shift management (partial)
  - Event types support
  - Logging system

- **Frontend (React Native + Expo)**
  - Company list/add/edit/delete screens
  - Employee list/add/edit/delete screens
  - Bottom tab navigation
  - Basic UI with icons

### ❌ Critical Issues for Production
1. **SECURITY**: MongoDB credentials hardcoded in `server.js`
2. **CONFIGURATION**: Hardcoded `localhost:5000` URLs in frontend
3. **NO AUTHENTICATION**: No user login/registration system
4. **NO SHIFT CALENDAR**: Events model exists but no UI to manage shifts
5. **NO ROLE-BASED ACCESS**: No admin vs regular user distinction
6. **NO DEPLOYMENT CONFIG**: Missing production environment setup

---

## 🎯 MVP Definition - Phase 1 (Google Play Store Ready)

### User Roles & Access Model (SIMPLIFIED)

#### **Admin Employees** (role='admin')
- First employee who registers becomes admin
- Full access to company settings
- Can add/remove employees
- Can manage all shifts
- Can promote other employees to admin
- Can demote admins to regular employees

#### **Regular Employees** (role='employee')
- Can view their own shifts
- Can view company calendar (read-only)
- Can view colleagues list (read-only)
- Cannot modify company settings
- Cannot add/remove other employees
- Cannot create/edit/delete shifts

**Key Simplification:**
- No separate User model - Employee IS the user
- No invitation system - admin creates accounts directly
- No multi-company per user - each employee belongs to ONE company
- Simple role field: 'admin' or 'employee'

### Core Features for Pharmacy Shift Management

#### 1. **User Authentication & Authorization** (CRITICAL - NEW)
- Email/password registration
- Login/logout functionality
- JWT token-based authentication
- User roles: `admin` or `employee`
- First user who creates a company becomes admin

#### 2. **Company Management** (EXISTS - NEEDS ENHANCEMENT)
- **Admin only**: Create/edit/delete companies
- Company profile: name, address, phone
- Company members list (admins + employees)
- Invite system: admin can invite users by email
- Admin can assign roles (admin/employee)

#### 3. **Employee Management** (EXISTS - NEEDS REFINEMENT)
- **Admin**: Add/edit/delete employees
- **Admin**: Link employees to user accounts (optional)
- **Employee**: View own profile
- Employee info: name, role, contact, linked user account

#### 4. **Shift Calendar** (CRITICAL - MISSING)
- **Admin view**: Full calendar with all shifts
  - Add/edit/delete any shift
  - Assign shifts to employees
  - Color-coded by employee

- **Employee view**: Personal calendar
  - View only own shifts
  - View company calendar (read-only)
  - See who else is working (optional)

#### 5. **Access Control**
- Company data isolation (users only see their companies)
- Role-based permissions (admin vs employee)
- Admins can manage multiple companies
- Employees can belong to multiple companies

---

## 🏗️ Data Model Updates

### Employee Model (UPDATED - This is the User!)
```javascript
{
  _id: ObjectId,
  email: String (unique, required), // Login credential
  password: String (hashed, required), // Login credential
  name: String (required),
  jobRole: String (optional), // e.g., "Pharmacist", "Technician", "Manager"
  workingHours: String (optional),
  companyId: ObjectId (ref: Company, required),
  role: String (enum: ['admin', 'employee'], default: 'employee'), // Permission level
  phone: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Key Points:**
- Employee IS the user (no separate User model needed)
- `email` + `password` = login credentials
- `role` = permission level ('admin' or 'employee')
- `jobRole` = actual job title (optional, for display)
- Each employee belongs to ONE company
- Admin employees can manage the company

### Company Model (MINIMAL CHANGES)
```javascript
{
  _id: ObjectId,
  name: String (required),
  address: String (optional),
  phone: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** First employee who creates a company automatically becomes admin

### Event/Shift Model (SIMPLIFIED)
```javascript
{
  _id: ObjectId,
  title: String (optional, default: employee name),
  dtStart: Date (required),
  dtEnd: Date (required),
  employeeId: ObjectId (ref: Employee, required),
  companyId: ObjectId (ref: Company, required),
  color: String (optional, for UI),
  notes: String (optional),
  createdBy: ObjectId (ref: Employee), // Who created this shift
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Implementation Plan

### Phase 1A: Authentication & Authorization (PRIORITY 1)
**Estimated Time: 2-3 days** (Simplified!)

#### Backend Changes:
1. **Update Employee Model**
   - Add `email` field (unique, required)
   - Add `password` field (hashed, required)
   - Add `role` field (enum: ['admin', 'employee'], default: 'employee')
   - Rename `role` to `jobRole` (to avoid confusion)
   - Add indexes for email

2. **Authentication Routes**
   - Install `bcryptjs`, `jsonwebtoken`
   - Create `/auth/register` - Register new employee (first one becomes admin)
   - Create `/auth/login` - Login with email/password, return JWT
   - Create `/auth/me` - Get current employee info
   - Create `/auth/change-password` - Change password

3. **Authorization Middleware**
   - `requireAuth`: Verify JWT token, attach employee to req.employee
   - `requireAdmin`: Check if req.employee.role === 'admin'
   - `requireSameCompany`: Check if resource belongs to employee's company

4. **Update Existing Routes**
   - **Companies**:
     - POST: First employee becomes admin
     - GET: Only return employee's company
     - PUT/DELETE: Require admin role

   - **Employees**:
     - POST: Hash password, require admin (except first registration)
     - GET: Filter by employee's companyId
     - PUT: Require admin OR same employee (for own profile)
     - DELETE: Require admin
     - Add route to promote employee to admin

   - **Events**:
     - All routes: Filter by employee's companyId
     - POST/PUT/DELETE: Require admin role
     - GET: All employees can view

#### Frontend Changes:
1. **Configuration**
   - Create `config.js` with API_URL
   - Replace all `localhost:5000` with `API_URL`

2. **Authentication Screens**
   - **Login screen**: Email + password
   - **Register screen**:
     - Email, password, name, company name (if first user)
     - Or just email, password, name (if joining existing company)
   - Store JWT token in AsyncStorage
   - Add token to all API requests (Authorization header)
   - Auto-logout on 401 errors

3. **Employee Context** (Simplified!)
   - Create EmployeeContext to store logged-in employee info
   - Include: id, name, email, role, companyId
   - Provide throughout app

4. **Navigation Update**
   - Add auth stack (Login/Register)
   - Show main app only when authenticated
   - Conditional rendering based on employee.role

---

### Phase 1B: Role-Based UI (PRIORITY 2)
**Estimated Time: 1-2 days** (Simplified!)

#### Frontend Changes:
1. **Company Management**
   - **Admin**: Show edit/delete buttons
   - **Employee**: Read-only view (just company name/info)
   - Remove "Add Company" (company created during registration)

2. **Employee Management**
   - **Admin**: Full CRUD access (add, edit, delete, promote to admin)
   - **Employee**: View-only list of colleagues
   - Show role badge (Admin/Employee) in employee list

3. **Conditional Rendering**
   - Create `<AdminOnly>` component wrapper
   - Use `employee.role === 'admin'` to show/hide features
   - Simple and clean

---

### Phase 1C: Shift Calendar UI (PRIORITY 3)
**Estimated Time: 4-5 days**

#### Backend:
1. **Simplify Event Model** (as defined above)

2. **Event Routes**
   - GET `/events?companyId=X&month=Y&year=Z` (all members)
   - GET `/events/my-shifts?companyId=X` (employee's own shifts)
   - POST `/events` (admin only)
   - PUT `/events/:id` (admin only)
   - DELETE `/events/:id` (admin only)

#### Frontend:
1. **Calendar Screen** (NEW)
   - Install `react-native-calendars`
   - Monthly calendar view
   - **Admin**: See all shifts, can add/edit
   - **Employee**: See own shifts highlighted, others in gray
   - Color-coded by employee
   - Tap date to see shifts for that day

2. **Add/Edit Shift Screen** (NEW - Admin Only)
   - Select employee (dropdown)
   - Select date (date picker)
   - Select start/end time (time picker)
   - Optional: notes field
   - Save button

3. **Shift List Screen** (NEW)
   - List shifts for selected date
   - **Admin**: Tap to edit, swipe to delete
   - **Employee**: View-only

4. **My Shifts Screen** (NEW - Employee View)
   - List of employee's upcoming shifts
   - Filter by date range
   - Simple, focused view

5. **Navigation Update**
   - Add "Calendar" tab (all users)
   - Add "My Shifts" tab (employees only)
   - Add "Manage" tab (admins only)

---

### Phase 1D: Polish & Testing (PRIORITY 4)
**Estimated Time: 2-3 days**

1. **UI/UX Improvements**
   - Consistent styling
   - Loading states
   - Error messages
   - Empty states
   - Confirmation dialogs for delete
   - Role badges and indicators

2. **Data Validation**
   - Backend: validate all inputs
   - Frontend: form validation
   - Prevent overlapping shifts (optional)
   - Validate permissions on every action

3. **Testing**
   - Test as admin user
   - Test as employee user
   - Test company membership flows
   - Test on Android device/emulator
   - Fix bugs

---

### Phase 1E: Deployment Preparation (PRIORITY 5)
**Estimated Time: 2-3 days**

#### Backend Deployment:
1. **Choose hosting**: Railway, Render, or Heroku
2. **Setup production MongoDB**: MongoDB Atlas
3. **Deploy backend**
4. **Get production API URL**

#### Frontend Deployment:
1. **Update app.json**:
   - Package name: `com.yourname.turnifacili`
   - Version code
   - Permissions
   - Description
   - Icons

2. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

3. **Test APK** on real device

4. **Google Play Console**:
   - Create developer account ($25)
   - Create app listing
   - Upload APK
   - Add screenshots
   - Add description
   - Submit for review

---

## 📋 Minimum Viable Feature Set

### Must Have (for Store Approval):
- ✅ User registration/login
- ✅ Role-based access (admin/employee)
- ✅ Create/manage companies (admin)
- ✅ Manage company members (admin)
- ✅ Add/manage employees (admin)
- ✅ Create/view/edit/delete shifts (admin)
- ✅ View own shifts (employee)
- ✅ Calendar view for all users
- ✅ Basic error handling
- ✅ Privacy policy page
- ✅ Proper app icon and screenshots

### Nice to Have (Post-MVP):
- 📅 Recurring shifts
- 📊 Shift reports/statistics
- 🔔 Push notifications
- 📤 Export to PDF/Excel
- 💬 Shift swap requests (employee feature)
- 👥 Employee availability
- 🌐 Multi-language
- 🎨 Dark mode
- 💼 Multiple business types

---

## 🔒 Security Checklist

- [ ] Move MongoDB credentials to environment variables
- [ ] Implement JWT authentication
- [ ] Hash passwords with bcrypt
- [ ] Validate all user inputs
- [ ] Implement role-based authorization
- [ ] Check company membership on all operations
- [ ] Use HTTPS for production API
- [ ] Add CORS configuration
- [ ] Sanitize database queries
- [ ] Add rate limiting (optional for MVP)

---

## 📱 Google Play Store Requirements

### Technical:
- [ ] Target Android API level 33+
- [ ] 64-bit support
- [ ] App signing key
- [ ] Privacy policy URL
- [ ] Content rating questionnaire

### Assets:
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (4-8 images)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)

### Legal:
- [ ] Privacy policy (required)
- [ ] Terms of service (recommended)
- [ ] Developer account ($25)

---

## ⏱️ Timeline Estimate (UPDATED - Simplified Model)

| Phase | Duration | Description |
|-------|----------|-------------|
| 1A: Auth & Authorization | 2-3 days | Employee login, JWT, roles |
| 1B: Role-Based UI | 1-2 days | Admin vs employee views |
| 1C: Shift Calendar | 4-5 days | Calendar UI, shift CRUD |
| 1D: Polish & Testing | 2-3 days | Bug fixes, validation, UX |
| 1E: Deployment | 2-3 days | Backend deploy, APK, store |
| **TOTAL** | **11-16 days** | Full-time work |

---

## 🎯 User Flows (SIMPLIFIED)

### First User (Becomes Admin):
1. Register → Enter email, password, name, company name
2. System creates company and employee record with role='admin'
3. Login → Access full admin features
4. Add other employees to company
5. Promote employees to admin if needed
6. Create and manage shifts

### Additional Admin:
1. Get added by existing admin with role='admin'
2. Login with email/password
3. Full access to manage company, employees, shifts

### Regular Employee:
1. Get added by admin with role='employee'
2. Login with email/password
3. View own shifts
4. View company calendar (read-only)
5. View colleagues list (read-only)

**Note:** No invitation system needed for MVP - admin creates employee accounts directly with temporary passwords, employees can change password on first login.

---

## 💡 Key Recommendations

1. **Start with Phase 1A** - Authentication and roles are foundational
2. **Keep roles simple** - Just admin and employee for MVP
3. **Test both user types** - Always test as admin AND employee
4. **Clear visual indicators** - Make it obvious who is admin
5. **Graceful degradation** - If user has no companies, show onboarding
6. **Document permissions** - Create a permissions matrix document

---

## 📞 Next Steps

1. ✅ Review this plan and confirm approach
2. Set up development environment
3. Start with Phase 1A (Authentication & Authorization)
4. Create database models for User and CompanyMember
5. Implement auth routes and middleware
6. Build login/register screens

**Ready to start? I can help you implement Phase 1A step by step!**