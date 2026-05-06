const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🚀 Setting up PlacePredict database...\n');

    let connection;
    try {
        // Connect to MySQL (without database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'placepredict'}`);
        console.log(`✅ Database '${process.env.DB_NAME || 'placepredict'}' created/verified`);

        // Close connection and reconnect to the specific database
        await connection.end();

        // Connect to the specific database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'placepredict',
            multipleStatements: true
        });

        console.log('✅ Connected to PlacePredict database');

        // Create tables
        await createTables(connection);
        
        // Insert sample data
        await insertSampleData(connection);

        console.log('✅ Database schema created successfully');
        console.log('✅ Sample data inserted');

        // Update all existing users to be email verified
        await connection.execute('UPDATE users SET email_verified = TRUE WHERE email_verified = FALSE');
        console.log('✅ All users set as email verified');

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Demo Credentials:');
        console.log('👨‍💼 Admin: admin@placepredict.com / admin123');
        console.log('👨‍🎓 Student: john@titsbhiwani.ac.in / student123');
        console.log('\n🏫 College Email Domain: @titsbhiwani.ac.in');
        console.log('📝 New student registrations require official college email ID');
        console.log('\n🚀 Run "npm start" to start the application');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure MySQL is running');
        console.log('2. Check your database credentials in .env file');
        console.log('3. Ensure the database user has CREATE privileges');
        console.log('4. Try running: npm run check');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function createTables(connection) {
    // Users table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('student', 'admin') DEFAULT 'student',
            email_verified BOOLEAN DEFAULT FALSE,
            email_verification_token VARCHAR(255),
            password_reset_token VARCHAR(255),
            password_reset_expires TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Students table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS students (
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
            resume_filename VARCHAR(255),
            resume_original_name VARCHAR(255),
            resume_uploaded_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Companies table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS companies (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            sector VARCHAR(50),
            min_cgpa DECIMAL(3,2) DEFAULT 6.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Placements table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS placements (
            id INT PRIMARY KEY AUTO_INCREMENT,
            student_id INT NOT NULL,
            company_id INT,
            status ENUM('placed', 'not_placed', 'pending') DEFAULT 'pending',
            package_amount DECIMAL(10,2),
            placement_year YEAR DEFAULT (YEAR(CURDATE())),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
        )
    `);

    // Placement Statistics table for historical data and forecasting
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS placement_statistics (
            id INT PRIMARY KEY AUTO_INCREMENT,
            year YEAR NOT NULL UNIQUE,
            total_students INT NOT NULL,
            students_placed INT NOT NULL,
            placement_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((students_placed / total_students) * 100) STORED,
            average_package DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    console.log('✅ Tables created successfully');
}

async function insertSampleData(connection) {
    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        ['admin@placepredict.com']
    );

    if (existingAdmin.length === 0) {
        // Insert admin user (password: admin123) - email verified by default
        await connection.execute(`
            INSERT INTO users (name, email, password, role, email_verified) VALUES 
            ('Admin User', 'admin@placepredict.com', '$2a$10$LWWJWLjH0A2rapucpTWUb.h5v3d2KzYQN7LGyQi7vkZd0G0Yynndu', 'admin', TRUE)
        `);
        console.log('✅ Admin user created');
    }

    // Check if companies exist
    const [existingCompanies] = await connection.execute('SELECT COUNT(*) as count FROM companies');
    
    if (existingCompanies[0].count === 0) {
        // Insert sample companies
        await connection.execute(`
            INSERT INTO companies (name, sector, min_cgpa) VALUES 
            ('TCS', 'IT Services', 6.0),
            ('Infosys', 'IT Services', 6.5),
            ('Wipro', 'IT Services', 6.0),
            ('Google', 'Technology', 8.0),
            ('Microsoft', 'Technology', 7.5),
            ('Amazon', 'E-commerce', 7.0),
            ('Accenture', 'Consulting', 6.5)
        `);
        console.log('✅ Sample companies created');
    }

    // Check if sample students exist
    const [existingStudents] = await connection.execute(
        'SELECT id FROM users WHERE email IN (?, ?)',
        ['john@titsbhiwani.ac.in', 'jane@titsbhiwani.ac.in']
    );

    if (existingStudents.length === 0) {
        // Insert sample students with college email domain - email verified by default
        await connection.execute(`
            INSERT INTO users (name, email, password, role, email_verified) VALUES 
            ('John Doe', 'john@titsbhiwani.ac.in', '$2a$10$Jnn2uneSwOUHpQC27nrn/.m.NZ9XcbhkFHRbb/XQmIZejYEnjo29C', 'student', TRUE),
            ('Jane Smith', 'jane@titsbhiwani.ac.in', '$2a$10$Jnn2uneSwOUHpQC27nrn/.m.NZ9XcbhkFHRbb/XQmIZejYEnjo29C', 'student', TRUE)
        `);

        // Get the inserted user IDs
        const [johnUser] = await connection.execute('SELECT id FROM users WHERE email = ?', ['john@titsbhiwani.ac.in']);
        const [janeUser] = await connection.execute('SELECT id FROM users WHERE email = ?', ['jane@titsbhiwani.ac.in']);

        // Insert student profiles
        await connection.execute(`
            INSERT INTO students (user_id, cgpa, branch, skills, internship_experience, projects_count, aptitude_score, technical_skills_rating, projects_quality_rating) VALUES 
            (?, 8.5, 'Computer Science', 'JavaScript, Python, React, Node.js', 6, 3, 85.5, 8, 7),
            (?, 7.2, 'Information Technology', 'Java, Spring Boot, MySQL, Angular', 3, 2, 78.0, 7, 6)
        `, [johnUser[0].id, janeUser[0].id]);

        // Insert sample placements
        const [johnStudent] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [johnUser[0].id]);
        const [janeStudent] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [janeUser[0].id]);

        await connection.execute(`
            INSERT INTO placements (student_id, company_id, status, package_amount, placement_year) VALUES 
            (?, 1, 'placed', 4.5, 2024),
            (?, 2, 'not_placed', NULL, 2024)
        `, [johnStudent[0].id, janeStudent[0].id]);

        console.log('✅ Sample students and placements created');
    }

    // Insert sample placement statistics for forecasting
    const [existingStats] = await connection.execute('SELECT COUNT(*) as count FROM placement_statistics');
    
    if (existingStats[0].count === 0) {
        await connection.execute(`
            INSERT INTO placement_statistics (year, total_students, students_placed, average_package) VALUES 
            (2019, 120, 85, 4.2),
            (2020, 135, 95, 4.5),
            (2021, 140, 98, 4.8),
            (2022, 150, 112, 5.2),
            (2023, 160, 128, 5.6),
            (2024, 170, 140, 6.1)
        `);
        console.log('✅ Sample placement statistics created for forecasting');
    }
}

// Run setup
setupDatabase();