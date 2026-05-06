# PlacePredict - College Placement Analytics & Prediction System

A comprehensive full-stack web application for predicting college placement outcomes and analyzing placement trends.

## 🚀 Features

### 🔐 Authentication System
- Student registration & login
- Admin login with role-based access
- JWT-based authentication
- Secure password hashing with bcrypt

### 👨‍🎓 Student Module
- Complete profile management (CGPA, skills, internships, projects)
- Placement probability prediction
- Personalized improvement suggestions
- Interactive dashboard with analytics

### 👨‍💼 Admin Module
- Comprehensive analytics dashboard
- Student management system
- Company management
- Placement status tracking
- Data visualization with charts

### 📊 Analytics Dashboard
- Branch-wise placement statistics
- CGPA vs placement correlation
- Year-wise placement trends
- Interactive charts using Chart.js

### 🎯 Prediction Algorithm
Rule-based scoring system:
```
Score = (CGPA × 0.4) + (Technical Skills × 0.3) + (Internship Experience × 0.2) + (Projects Quality × 0.1)

If Score ≥ 70 → "Likely Placed"
Else → "Improvement Required"
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt
- **Charts**: Chart.js
- **Styling**: Custom CSS with Bootstrap

## 📁 Project Structure

```
placepredict/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── studentController.js # Student operations
│   └── adminController.js   # Admin operations
├── database/
│   └── schema.sql          # Database schema
├── middleware/
│   └── auth.js             # JWT middleware
├── models/
│   ├── User.js             # User model
│   ├── Student.js          # Student model
│   └── Company.js          # Company model
├── public/
│   ├── css/
│   │   └── style.css       # Custom styles
│   └── js/
│       └── auth.js         # Frontend utilities
├── routes/
│   ├── auth.js             # Auth routes
│   ├── student.js          # Student routes
│   └── admin.js            # Admin routes
├── views/
│   ├── index.html          # Landing page
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── student-dashboard.html
│   ├── student-profile.html
│   └── admin-dashboard.html
├── .env                    # Environment variables
├── package.json            # Dependencies
├── server.js              # Main server file
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd placepredict
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   - Create a MySQL database named `placepredict`
   - Import the schema:
   ```bash
   mysql -u root -p placepredict < database/schema.sql
   ```

4. **Configure Environment Variables**
   - Copy `.env` file and update database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=placepredict
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and go to: `http://localhost:3000`

## 🔑 Demo Credentials

### Admin Login
- **Email**: admin@placepredict.com
- **Password**: admin123

### Student Login
- **Email**: john@student.com
- **Password**: student123

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    skills TEXT,
    internship_experience INT DEFAULT 0,
    projects_count INT DEFAULT 0,
    aptitude_score DECIMAL(5,2) DEFAULT 0,
    technical_skills_rating INT DEFAULT 0,
    projects_quality_rating INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Companies Table
```sql
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    min_cgpa DECIMAL(3,2) DEFAULT 6.0
);
```

### Placements Table
```sql
CREATE TABLE placements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    company_id INT,
    status ENUM('placed', 'not_placed', 'pending') DEFAULT 'pending',
    package DECIMAL(10,2),
    placement_year YEAR DEFAULT (YEAR(CURDATE())),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Student Routes
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/prediction` - Get placement prediction

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard analytics
- `GET /api/admin/students` - Get all students
- `PUT /api/admin/placement-status` - Update placement status
- `GET /api/admin/companies` - Get all companies
- `POST /api/admin/companies` - Add new company
- `PUT /api/admin/companies/:id` - Update company
- `DELETE /api/admin/companies/:id` - Delete company

## 🎨 Features Walkthrough

### For Students:
1. **Register/Login** - Create account or login
2. **Complete Profile** - Add CGPA, skills, experience
3. **View Prediction** - Get placement probability
4. **Dashboard Analytics** - View personal analytics
5. **Improvement Tips** - Get personalized suggestions

### For Admins:
1. **Analytics Dashboard** - View comprehensive statistics
2. **Student Management** - Manage student data
3. **Company Management** - Add/edit companies
4. **Placement Tracking** - Update placement status
5. **Data Visualization** - Interactive charts and graphs

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🚀 Production Deployment

1. **Environment Setup**
   - Set production environment variables
   - Use strong JWT secret
   - Configure production database

2. **Database Setup**
   - Create production MySQL database
   - Run schema migration
   - Set up database backups

3. **Server Configuration**
   - Use process manager (PM2)
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Future Enhancements

- CSV import/export functionality
- Email notifications
- Advanced analytics
- Mobile responsive design improvements
- Real-time updates with WebSockets
- Machine learning-based predictions

---

**PlacePredict** - Empowering students with data-driven placement insights! 🎓📊