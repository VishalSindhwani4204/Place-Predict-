const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const preparationRoutes = require('./routes/preparation');
const skillAnalysisRoutes = require('./routes/skillAnalysis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/preparation', preparationRoutes);
app.use('/api/skill-analysis', skillAnalysisRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forgot-password.html'));
});

app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset-password.html'));
});

app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student-dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
});

app.get('/student-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'student-profile.html'));
});

app.get('/preparation-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'preparation-dashboard.html'));
});

app.get('/modern-student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modern-student-layout.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'PlacePredict API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.get('/test-registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-registration.html'));
});

app.get('/modern-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modern-dashboard.html'));
});

app.get('/modern-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modern-profile.html'));
});

app.get('/modern-student', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modern-student-layout.html'));
});

app.get('/modern-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'modern-admin-layout.html'));
});

app.get('/skill-analysis', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'skill-analysis-dashboard.html'));
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();
        
        app.listen(PORT, () => {
            console.log(`🚀 PlacePredict server running on http://localhost:${PORT}`);
            console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin-dashboard`);
            console.log(`👨‍🎓 Student Dashboard: http://localhost:${PORT}/student-dashboard`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();