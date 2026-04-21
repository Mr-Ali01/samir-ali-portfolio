const http = require('http');
const db = require('./src/config/db'); // Load MySQL connection pool
const serveStaticFile = require('./src/utils/serveStatic'); // Native Static UI Server
const fs = require('fs');
const path_mod = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// --- AUTO-MIGRATION: Ensure DB Schema is correct ---
(async () => {
    try {
        // 1. Drop old generic sections table if it exists (As requested)
        await db.query("DROP TABLE IF EXISTS sections");

        // 2. Create Dedicated Hero Section Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS hero_section (
                id INT AUTO_INCREMENT PRIMARY KEY,
                main_name VARCHAR(255) DEFAULT 'SAMIR ALY',
                status_badge VARCHAR(100) DEFAULT 'Available now',
                headline TEXT,
                btn_1_label VARCHAR(100) DEFAULT 'Get in Touch',
                btn_2_label VARCHAR(100) DEFAULT 'View Projects',
                btn_3_label VARCHAR(100) DEFAULT 'Resume',
                stat_1_val VARCHAR(50) DEFAULT '2+',
                stat_1_lab VARCHAR(100) DEFAULT 'Years coding',
                stat_2_val VARCHAR(50) DEFAULT '15+',
                stat_2_lab VARCHAR(100) DEFAULT 'Projects built',
                stat_3_val VARCHAR(50) DEFAULT '100%',
                stat_3_lab VARCHAR(100) DEFAULT 'Passion driven',
                image_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
        
        // 3. Seed Initial Hero Data if empty
        const [hero] = await db.query("SELECT id FROM hero_section LIMIT 1");
        if (hero.length === 0) {
            await db.query(`
                INSERT INTO hero_section (
                    main_name, status_badge, headline, 
                    btn_1_label, btn_2_label, btn_3_label,
                    stat_1_val, stat_1_lab, stat_2_val, stat_2_lab, stat_3_val, stat_3_lab,
                    image_url
                ) VALUES (
                    'SAMIR ALY', 'Available now', 
                    'Full Stack Developer building fast, beautiful, and purposeful web experiences.',
                    'Get in Touch', 'View Projects', 'Resume',
                    '2+', 'Years coding', '15+', 'Projects built', '100%', 'Passion driven',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
                )
            `);
        } else {
            // One-time fix: Ensure existing relative images start with a slash
            await db.query("UPDATE hero_section SET image_url = CONCAT('/', image_url) WHERE image_url LIKE 'images/uploads/%'");
        }

        // --- MIGRATION: Ensure education table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS education (
                id INT AUTO_INCREMENT PRIMARY KEY,
                degree VARCHAR(255) NOT NULL,
                institution VARCHAR(255) NOT NULL,
                period VARCHAR(100) NOT NULL,
                description TEXT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // --- MIGRATION: Ensure experience table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS experience (
                id INT AUTO_INCREMENT PRIMARY KEY,
                role VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                period VARCHAR(100) NOT NULL,
                description TEXT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // --- MIGRATION: Ensure About Table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS about (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url TEXT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Seed initial about data if empty
        const [aboutRows] = await db.query("SELECT id FROM about LIMIT 1");
        if (aboutRows.length === 0) {
            const longDesc = "I am a passionate and innovative developer dedicated to crafting immersive digital experiences. With a strong foundation in core web technologies, I continually strive to deliver seamless, scalable, and beautifully designed user interfaces.\\n\\nI provide modern web development solutions focused on performance, scalability, and precise user experience.";
            await db.query(`
                INSERT INTO about (title, description, image_url) 
                VALUES (?, ?, ?)
            `, ["About Me", longDesc, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"]);
        }

        // --- MIGRATION: Ensure Skills Table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS skills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                 Proficiency INT DEFAULT 100,
                category VARCHAR(100) DEFAULT 'Technical',
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Seed initial skills data if empty
        const [skillsRows] = await db.query("SELECT id FROM skills LIMIT 1");
        if (skillsRows.length === 0) {
            const initialSkills = [
                // Development
                { name: 'Java', Proficiency: 90, category: 'Development' },
                { name: 'Spring Core', Proficiency: 85, category: 'Development' },
                { name: 'JDBC', Proficiency: 88, category: 'Development' },
                { name: 'Hibernate', Proficiency: 80, category: 'Development' },
                { name: 'JavaScript', Proficiency: 92, category: 'Development' },
                { name: 'Node.js', Proficiency: 85, category: 'Development' },
                { name: 'HTML', Proficiency: 95, category: 'Development' },
                // Databases
                { name: 'MySQL', Proficiency: 88, category: 'Databases' },
                // Tools
                { name: 'Git', Proficiency: 90, category: 'Tools' },
                { name: 'GitHub', Proficiency: 90, category: 'Tools' },
                { name: 'Antigravity', Proficiency: 100, category: 'Tools' },
                { name: 'Vs Code', Proficiency: 95, category: 'Tools' },
                { name: 'Eclipse', Proficiency: 85, category: 'Tools' },
                { name: 'CLI', Proficiency: 90, category: 'Tools' },
                // Learning
                { name: 'React', Proficiency: 40, category: 'Learning' },
                { name: 'OpenAI API', Proficiency: 50, category: 'Learning' },
                { name: 'Spring Boot', Proficiency: 60, category: 'Learning' },
                { name: 'REST API', Proficiency: 70, category: 'Learning' },
                // Design
                { name: 'Canva', Proficiency: 85, category: 'Design' },
                // Styling
                { name: 'Tailwind CSS', Proficiency: 95, category: 'Styling' },
                { name: 'CSS', Proficiency: 95, category: 'Styling' }
            ];

            for (const s of initialSkills) {
                await db.query(`
                    INSERT INTO skills (name, Proficiency, category) 
                    VALUES (?, ?, ?)
                `, [s.name, s.Proficiency, s.category]);
            }
        }

        // --- MIGRATION: Ensure About Page Table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS about_page (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                badge_text VARCHAR(255),
                description TEXT,
                image_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Seed about_page data if empty
        const [aboutPageRows] = await db.query("SELECT id FROM about_page LIMIT 1");
        if (aboutPageRows.length === 0) {
            await db.query(`
                INSERT INTO about_page (title, badge_text, description, image_url) 
                VALUES (?, ?, ?, ?)
            `, [
                "About Me",
                "🚀 WHO AM I?",
                "I am a passionate Full-Stack Developer dedicated to crafting immersive and scalable digital experiences. With a deep understanding of modern web technologies, I focus on performance, accessibility, and high-impact design.\\n\\nMy journey in tech is driven by an insatiable curiosity and a commitment to excellence. I thrive on solving complex problems and turning ambitious ideas into polished, user-centric applications using a visual-first development approach.",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
            ]);
        }

        // --- MIGRATION: Ensure Stats Tables exist ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS site_stats (
                stat_name VARCHAR(100) PRIMARY KEY,
                stat_value INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
        // Seed Total Visits if missing
        const [totalVisitsStat] = await db.query("SELECT * FROM site_stats WHERE stat_name = 'total_visits'");
        if (totalVisitsStat.length === 0) {
            await db.query("INSERT INTO site_stats (stat_name, stat_value) VALUES ('total_visits', 0)");
        }

        await db.query(`
            CREATE TABLE IF NOT EXISTS daily_visits (
                visit_date DATE PRIMARY KEY,
                count INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        // --- MIGRATION: Ensure certifications table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS certifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                issuer VARCHAR(255) NOT NULL,
                date VARCHAR(100),
                description TEXT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Seed Education & Certifications if empty
        const [eduRows] = await db.query('SELECT id FROM education LIMIT 1');
        if (eduRows.length === 0) {
            await db.query(`INSERT INTO education (period, degree, institution, description) VALUES 
                ('2018 — 2022', 'Bachelor of Science in Computer Science', 'Example State University', 'Specialized in Software Engineering and Artificial Intelligence. Graduated with honors.'),
                ('2016 — 2018', 'High School Diploma', 'Central High School', '')`);
        }

        const [certRows] = await db.query('SELECT id FROM certifications LIMIT 1');
        if (certRows.length === 0) {
            await db.query(`INSERT INTO certifications (name, issuer, date) VALUES 
                ('AWS Certified Solutions Architect – Associate', 'Amazon Web Services (AWS)', '2023'),
                ('React Developer Nanodegree', 'Udacity', '2022'),
                ('Google UX Design Professional Certificate', 'Coursera', '2021')`);
        }

        // --- MIGRATION: Ensure projects table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) DEFAULT 'Featured',
                short_description TEXT,
                description TEXT,
                tech_stack VARCHAR(255),
                preview_image TEXT,
                live_link VARCHAR(255),
                github_link VARCHAR(255),
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // --- MIGRATION: Ensure project_label column exists in projects table ---
        try {
            await db.query("ALTER TABLE projects ADD COLUMN project_label VARCHAR(100) DEFAULT 'Top Rated'");
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') {
                console.warn('Migration add project_label column error:', e.message);
            }
        }

        // =========================================================
        // ONE-TIME DATABASE FALLBACK SEEDER (NOT STATIC FRONTEND)
        // =========================================================
        // This 'projectsData' array only injects placeholder rows into MySQL
        // strictly if the 'projects' table is completely empty on fresh install.
        // It ensures your portfolio doesn't look blank out of the box. 
        // 100% of the live website content is fetched dynamically from the DB.
        const [existingProjects] = await db.query('SELECT id FROM projects LIMIT 1');
        if (existingProjects.length === 0) {
            const projectsData = [
                ['WhatsApp Web Clone', 'Featured', 'A responsive messaging interface inspired by WhatsApp Web, built to study UI design and real-time communication.', 'React, Message, Realtime', 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=1000', '#', '#'],
                ['Developer Portfolio System', 'Featured', 'A personal developer portfolio featuring a dynamic CMS, multiple project showcases, and detailed information bars.', 'React, Next.js, Framer Motion', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000', '#', '#'],
                ['SaveReels Downloader', 'Featured', 'A web tool that allows users to download reels from Instagram. The application extracts the video source and...', 'React, API, Tailwind', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000', '#', '#'],
                ['Bank Management System', 'Utility', 'A robust console-based application featuring real-time database connectivity, account creation algorithms, and secure transactional tracking.', 'Core Java, JDBC, MySQL', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', '#', '#'],
                ['Ticket Management System', 'Utility', 'An efficient system tailored around advanced collection frameworks to store user and ticket information.', 'Core Java, Data Structures', 'https://images.unsplash.com/photo-1522881451255-f59c4bafb1a5?auto=format&fit=crop&q=80&w=800', '#', '#'],
                ['Dynamic Weather App', 'Featured', 'A modern web-based interface querying real-time forecasting data dynamically triggered by user input.', 'HTML/CSS, JS, Web APIs', 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800', '#', '#'],
                ['Favicon Fetch API', 'Utility', 'A utility API that retrieves a website\'s favicon from any URL...', 'Node.js, Express, Cheerio', '', '#', '#'],
                ['SaveLinks — Link Manager', 'Utility', 'A lightweight web application for saving and organizing useful links.', 'React, LocalStorage, Tailwind', '', '#', '#'],
                ['Food Discovery App UI', 'Design', 'A complete multi-page UI template for a food discovery platform...', 'HTML, CSS, JavaScript', '', '#', '#']
            ];

            for (const p of projectsData) {
                await db.query(`INSERT INTO projects (name, category, short_description, tech_stack, preview_image, live_link, github_link) VALUES (?, ?, ?, ?, ?, ?, ?)`, p);
            }
        }
        // --- MIGRATION: Ensure contacts table exists ---
        // Force recreation once to ensure all columns (company, inquiry_type, etc) are present
        // await db.query("DROP TABLE IF EXISTS contacts"); 
        await db.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                company VARCHAR(255),
                role VARCHAR(100),
                inquiry_type VARCHAR(100),
                message TEXT,
                budget VARCHAR(100),
                timeline VARCHAR(100),
                status ENUM('new', 'read', 'replied') DEFAULT 'new',
                reply TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // --- MIGRATION: Ensure settings table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value TEXT,
                category VARCHAR(50),
                is_secret BOOLEAN DEFAULT FALSE,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Seed initial settings if empty
        const [settingsRows] = await db.query("SELECT setting_key FROM settings");
        if (settingsRows.length === 0) {
            const initialSettings = [
                ['experience_mode', 'professional', 'system', false],
                ['theme_mode', 'dark', 'ui', false],
                ['motion_control', 'full', 'ui', false],
                ['visual_effects', JSON.stringify({ glow: true, blur: true, shadows: true }), 'ui', false],
                ['auto_reply', 'off', 'communication', false],
                ['default_communication', 'email', 'communication', false]
            ];
            for (const s of initialSettings) {
                await db.query("INSERT INTO settings (setting_key, setting_value, category, is_secret) VALUES (?, ?, ?, ?)", s);
            }
        }

        // --- MIGRATION: Ensure email_templates table exists ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS email_templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) UNIQUE,
                subject VARCHAR(255),
                body TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Seed initial templates if empty
        const [templateRows] = await db.query("SELECT id FROM email_templates");
        if (templateRows.length === 0) {
            await db.query(`INSERT INTO email_templates (name, subject, body) VALUES 
                ('inquiry_ack', 'Thank you for reaching out!', 'Hi {{name}},\\n\\nThank you for your inquiry regarding {{inquiry_type}}. I have received your message and will review it shortly.\\n\\nBest regards,\\nSamir Ali'),
                ('admin_notify', '🚀 New Portfolio Inquiry: {{inquiry_type}}', 'You have a new inquiry from {{name}} ({{email}}).\\n\\nMessage: {{message}}')
            `);
        }

    } catch (e) {
        console.warn('Migration Skip/Failed:', e.message);
    }
})();

// 3. Import Auth & Utility Libraries
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- NODEMAILER: Setup SMTP Transport ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Global Helpers for Settings & Templates
 */
const getSetting = async (key, defaultValue = null) => {
    try {
        const [rows] = await db.query("SELECT setting_value FROM settings WHERE setting_key = ?", [key]);
        if (rows.length === 0) return defaultValue;
        try { return JSON.parse(rows[0].setting_value); }
        catch (e) { return rows[0].setting_value; }
    } catch (e) { return defaultValue; }
};

const getTemplate = async (name) => {
    try {
        const [rows] = await db.query("SELECT subject, body FROM email_templates WHERE name = ?", [name]);
        if (rows.length === 0) return null;
        return { subject: rows[0].subject, body: rows[0].body };
    } catch (e) { return null; }
};

const replacePlaceholders = (text, data) => {
    let result = text;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key] || '');
    });
    return result;
};

const getTransporter = async () => {
    const smtpConfig = await getSetting('smtp_config');
    if (smtpConfig && smtpConfig.user && smtpConfig.pass) {
        return nodemailer.createTransport({
            host: smtpConfig.host || 'smtp.gmail.com',
            port: smtpConfig.port || 465,
            secure: smtpConfig.secure !== undefined ? smtpConfig.secure : true,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass
            }
        });
    }
    return transporter; // Fallback to .env-based transporter
};

/**
 * Utility: Parse JSON Request Body (Native Node.js)
 */
const parseJSONBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { resolve({}); }
        });
        req.on('error', (err) => reject(err));
    });
};

// Central Request Handler utilizing Node's core HTTP module natively
const requestHandler = async (req, res) => {
    // 0. Base URL and Path
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const path = url.pathname;

    // 1. Establish strict CORS & Content-Type Headers
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight active OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- API: File Upload (Native) ---
    if (path === '/api/v1/upload' && req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            try {
                const buffer = Buffer.concat(chunks);
                // Extract filename from header or use default
                const fileName = req.headers['x-file-name'] || `upload_${Date.now()}.png`;
                const uploadPath = path_mod.join(__dirname, 'public', 'images', 'uploads', fileName);
                
                // Ensure directory exists (basic check)
                const dir = path_mod.join(__dirname, 'public', 'images', 'uploads');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                fs.writeFileSync(uploadPath, buffer);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url: `/images/uploads/${fileName}` }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // --- API: Admin Google Auth (DB-Backed & Secure) ---
    if (path === '/api/v1/auth/google' && req.method === 'POST') {
        try {
            const { token } = await parseJSONBody(req);
            let email, name, picture;

            // --- DEV MODE: Bypass Google verification if unconfigured ---
            const IS_DEV_MOCK = token === 'dev-mock-token';
            if (IS_DEV_MOCK && process.env.NODE_ENV === 'development') {
                email = 'sameerali18867@gmail.com'; // Hardcoded dev bypass
                name = 'Samir (Dev Mode)';
                picture = '';
            } else {
                // A. Verify Google Token (Official Library)
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                email = payload.email;
                name = payload.name;
                picture = payload.picture;
            }

            // B. Database-Driven Authorization (Validate from admins table)
            const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
            
            if (admins.length === 0) {
                // If not in DB, but matches Super Admin hardcode (for first setup)
                const SUPER_ADMIN_EMAIL = 'sameerali18867@gmail.com';
                if (email !== SUPER_ADMIN_EMAIL) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, error: 'Access Denied: Unauthorized Admin' }));
                }
            }

            // C. Generate Performance JWT
            const jwtToken = jwt.sign(
                { email, name, role: 'super_admin' },
                process.env.JWT_SECRET || 'fallback_secret_key',
                { expiresIn: '1d' }
            );

            // D. Set Secure httpOnly Cookie
            res.setHeader('Set-Cookie', [
                `portfolio_auth_token=${jwtToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`
            ]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
                success: true, 
                message: IS_DEV_MOCK ? '⚠️ Authenticated Successfully via Developer Mode (No Google API used)' : '✅ Authenticated Successfully via Google OAuth',
                user: { name, email, picture }
            }));
        } catch (error) {
            console.error('Auth Server Error:', error);
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: 'Authentication Failed', 
                details: error.message 
            }));
        }
        return;
    }
    // --- API: Admin Auth Status (Check if logged in) ---
    if (path === '/api/v1/auth/status' && req.method === 'GET') {
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized: No token provided' }));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, user: decoded }));
        } catch (error) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized: Invalid or expired token' }));
        }
    }

    /**
     * Helper: Track Visitor (Dynamic Counting)
     */
    const trackVisitor = async () => {
        try {
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            // Increment Total Visits
            await db.query("UPDATE site_stats SET stat_value = stat_value + 1 WHERE stat_name = 'total_visits'");
            // Increment Daily Visits
            await db.query("INSERT INTO daily_visits (visit_date, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1", [today]);
        } catch (err) {
            console.error('Visitor tracking error:', err.message);
        }
    };

    /**
     * API: Unified Dashboard Stats (Internal Admin Use)
     */
    if (path === '/api/v1/admin/stats' && req.method === 'GET') {
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];
        
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized: No session token' }));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

            // Fetch Counts with proper error trapping
            const [projects] = await db.query('SELECT COUNT(*) as count FROM projects').catch(() => [[{count:0}]]);
            const [messages] = await db.query('SELECT COUNT(*) as count FROM contacts').catch(() => [[{count:0}]]);
            const [totalVisits] = await db.query("SELECT stat_value FROM site_stats WHERE stat_name = 'total_visits'").catch(() => [[{stat_value:0}]]);
            const today = new Date().toISOString().slice(0, 10);
            const [todayVisits] = await db.query("SELECT count FROM daily_visits WHERE visit_date = ?", [today]).catch(() => [[{count:0}]]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                stats: {
                    projects: projects[0].count,
                    messages: messages[0].count,
                    totalVisits: totalVisits[0]?.stat_value || 0,
                    todayVisits: todayVisits[0]?.count || 0
                }
            }));
        } catch (error) {
            console.error('Stats API Failure:', error.message);
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Session expired or unauthorized' }));
        }
    }

    /**
     * API: Submit Public Contact Inquiry
     */
    if (path === '/api/v1/contacts' && req.method === 'POST') {
        try {
            const rawBody = await parseJSONBody(req);
            const { name, email, company, role, inquiry_type, message, budget, timeline } = rawBody;

            if (!name || !email || !message) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'Name, Email and Message are required' }));
            }

            // 1. Save to Database
            await db.query(
                `INSERT INTO contacts (name, email, company, role, inquiry_type, message, budget, timeline) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, email, company || null, role || null, inquiry_type || 'general', message, budget || null, timeline || null]
            );

            // 2. Dynamic Communication Logic
            const settings = {
                auto_reply: await getSetting('auto_reply', 'off'),
                admin_email: process.env.ADMIN_EMAIL || 'sameerali18867@gmail.com'
            };

            const data = { name, email, inquiry_type, message, date: new Date().toLocaleDateString() };

            // A. Admin Notification
            const adminTpl = await getTemplate('admin_notify');
            const dynamicTransporter = await getTransporter();
            if (adminTpl) {
                const subject = replacePlaceholders(adminTpl.subject, data);
                const body = replacePlaceholders(adminTpl.body, data);
                
                dynamicTransporter.sendMail({
                    from: `"Portfolio Alert" <${process.env.SMTP_USER}>`,
                    to: settings.admin_email,
                    subject: subject,
                    html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:10px;">
                            <h2 style="color:#3b82f6;">New Inquiry Received</h2>
                            <p>${body.replace(/\n/g, '<br>')}</p>
                            <hr>
                            <p><small>View in Dashboard: <a href="${process.env.ALLOWED_ORIGIN_URL}/admin/messages.html">Admin Console</a></small></p>
                           </div>`
                }).catch(err => console.error('Admin Notify Error:', err.message));
            }

            // B. Auto-Reply to User
            if (settings.auto_reply === 'on') {
                const userTpl = await getTemplate('inquiry_ack');
                if (userTpl) {
                    const subject = replacePlaceholders(userTpl.subject, data);
                    const body = replacePlaceholders(userTpl.body, data);

                    dynamicTransporter.sendMail({
                        from: `"Samir Ali" <${process.env.SMTP_USER}>`,
                        to: email,
                        subject: subject,
                        html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:10px;">
                                ${body.replace(/\n/g, '<br>')}
                                <br><br>
                                <p><strong>Samir Ali</strong><br>Full Stack Developer</p>
                               </div>`
                    }).catch(err => console.error('Auto-Reply Error:', err.message));
                }
            }

            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: 'Inquiry submitted successfully' }));
        } catch (error) {
            console.error('Contact API Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Submission failed' }));
        }
        return;
    }

    if (path === '/api/v1/test-db' && req.method === 'GET') {
        try {
            const [rows] = await db.query('SELECT 1 + 1 AS result');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: 'DB Connection OK', data: rows }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }

    /**
     * API: Get Global Settings
     */
    if (path === '/api/v1/settings' && req.method === 'GET') {
        try {
            const [rows] = await db.query("SELECT setting_key, setting_value, category FROM settings WHERE is_secret = FALSE");
            const settings = {};
            rows.forEach(r => {
                try { settings[r.setting_key] = JSON.parse(r.setting_value); }
                catch(e) { settings[r.setting_key] = r.setting_value; }
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, settings }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }

    /**
     * API: Update Global Settings (Admin Protected)
     */
    if (path === '/api/v1/settings/update' && req.method === 'POST') {
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
            const { key, value } = await parseJSONBody(req);
            if (!key) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'Setting key required' }));
            }

            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            await db.query("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?", [key, stringValue, stringValue]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: `Setting ${key} updated` }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }

    /**
     * API: Manage Email Templates
     */
    if (path === '/api/v1/manage/email-templates' && req.method === 'GET') {
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
            const [rows] = await db.query("SELECT * FROM email_templates");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, templates: rows }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }

    if (path === '/api/v1/manage/email-templates/update' && req.method === 'POST') {
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
            const { id, subject, body } = await parseJSONBody(req);
            if (!id || !subject || !body) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'ID, Subject, and Body required' }));
            }

            await db.query("UPDATE email_templates SET subject = ?, body = ? WHERE id = ?", [subject, body, id]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: 'Template updated successfully' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }

    /**
     * API: Admin Reply to Inquiry
     */
    if (path === '/api/v1/manage/contacts/reply' && req.method === 'POST') {
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];
        
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
            const { id, reply_message } = await parseJSONBody(req);

            if (!id || !reply_message) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'ID and Reply Message required' }));
            }

            // 1. Fetch Contact Details
            const [contacts] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
            if (contacts.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'Contact not found' }));
            }
            const contact = contacts[0];

            // 2. Update DB
            await db.query('UPDATE contacts SET reply = ?, status = "replied" WHERE id = ?', [reply_message, id]);

            // 3. Send Email to Client
            const mailOptions = {
                from: `"Samir Ali" <${process.env.SMTP_USER}>`,
                to: contact.email,
                subject: `Re: Your Inquiry - Samir Ali Portfolio`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 15px; color: #333;">
                        <h2 style="color: #38bdf8;">Hello ${contact.name},</h2>
                        <p>Thank you for reaching out! Regarding your inquiry about <strong>${contact.inquiry_type}</strong>:</p>
                        <div style="background: #f4f8fa; padding: 20px; border-left: 4px solid #38bdf8; border-radius: 5px; margin: 20px 0; font-style: italic;">
                            "${contact.message}"
                        </div>
                        <p><strong>Response:</strong></p>
                        <p style="line-height: 1.6;">${reply_message.replace(/\n/g, '<br>')}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #999;">Best regards,<br><strong>Samir Ali</strong><br>Full Stack Developer</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: 'Reply sent and recorded' }));
        } catch (error) {
            console.error('Admin Reply Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Reply failed' }));
        }
        return;
    }

    // --- API: Section Content (Public & Admin) ---
    if (path.startsWith('/api/v1/manage/')) {
        const entity = path.split('/')[4]; // e.g., 'education', 'experience', 'projects', 'hero_section'
        
        // 1. GET (READ ALL)
        if (req.method === 'GET') {
            try {
                // Determine sort column dynamically
                let orderBy = 'ORDER BY created_at DESC';
                if (entity === 'hero_section' || entity === 'about_page') orderBy = 'ORDER BY updated_at DESC';
                else if (['education', 'experience', 'projects'].includes(entity)) orderBy = 'ORDER BY display_order ASC, created_at DESC';

                const [rows] = await db.query(`SELECT * FROM ${entity} ${orderBy}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, data: rows }));
            } catch (err) {
                console.error(`[DB ERROR] GET ${entity} optimized FETCH failed:`, err.message);
                try {
                    // Maximum fallback: Just SELECT * without any ordering
                    const [rows] = await db.query(`SELECT * FROM ${entity}`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: true, data: rows }));
                } catch (fatalErr) {
                    console.error(`[FATAL ERROR] GET ${entity} fallback FAILED:`, fatalErr.message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, error: 'Database resource not available' }));
                }
            }
        }

        // --- AUTH PROTECTED ROUTES (WRITE) ---
        const cookies = req.headers.cookie || '';
        const token = cookies.split('; ').find(row => row.startsWith('portfolio_auth_token='))?.split('=')[1];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'Auth Required' }));
        }

        // 2. POST (CREATE)
        if (req.method === 'POST') {
            try {
                const body = await parseJSONBody(req);
                const fields = Object.keys(body).join(', ');
                const values = Object.values(body);
                const placeholders = values.map(() => '?').join(', ');
                await db.query(`INSERT INTO ${entity} (${fields}) VALUES (${placeholders})`, values);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: 'Created successfully' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: err.message }));
            }
        }

        // 3. PUT (UPDATE) - requires ID/Identifier
        if (req.method === 'PUT') {
            try {
                const body = await parseJSONBody(req);
                const id = body.id;
                const sectionName = body.section_name;
                
                delete body.id;
                delete body.section_name;

                const setClause = Object.keys(body).map(k => `${k} = ?`).join(', ');
                const values = [...Object.values(body)];

                if (id) {
                    await db.query(`UPDATE ${entity} SET ${setClause} WHERE id = ?`, [...values, id]);
                } else if (entity === 'sections' && sectionName) {
                    await db.query(`UPDATE ${entity} SET ${setClause} WHERE section_name = ?`, [...values, sectionName]);
                } else {
                    throw new Error('Update requires an ID or section_name identifier');
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: 'Updated successfully' }));
            } catch (err) {
                console.error(`[PUT ${entity} ERROR]:`, err.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: err.message }));
            }
        }

        // 4. DELETE
        if (req.method === 'DELETE') {
            try {
                const { id } = await parseJSONBody(req);
                await db.query(`DELETE FROM ${entity} WHERE id = ?`, [id]);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: 'Deleted successfully' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: err.message }));
            }
        }
    }

    // Example API Status / DB Test Route
    if (path === '/api/ping' && req.method === 'GET') {
        try {
            // Test the database pool asynchronously
            const [rows] = await db.query('SELECT 1 + 1 AS solution');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: true,
                message: '🟢 Server is running natively (No Frameworks!). Database connection is active.',
                db_solution: rows[0].solution
            }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Database connection failed',
                details: error.message
            }));
        }
        return;
    }

    // 3. Serve Frontend / Static Assets (e.g. index.html, style.css, JS files) natively
    if ((req.method === 'GET' || req.method === 'HEAD') && !path.startsWith('/api')) {
        // Core Logic: Track visit only on main page loads (ignore assets like .css/js if possible)
        const isPage = path === '/' || path.endsWith('.html');
        if (isPage) await trackVisitor();
        
        // Admin SPA Routing: If accessing an admin sub-page directly, serve the dashboard shell
        // EXCEPT if it's an AJAX fragment request (fragment=true)
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        if (parsedUrl.pathname.startsWith('/admin/') && 
            parsedUrl.pathname.endsWith('.html') && 
            parsedUrl.pathname !== '/admin/dashboard.html' &&
            !parsedUrl.searchParams.get('fragment')) {
            
            console.log(`[SPA Redirect] Redirecting ${parsedUrl.pathname} to dashboard shell`);
            return serveStaticFile(res, '/admin/dashboard.html');
        }

        return serveStaticFile(res, path);
    }

    // Default 404 Fallback for unmapped API routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'API Route Not Found' }));
};

// Start the HTTP Server natively
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`🚀 Native HTTP Server listening on http://localhost:${PORT}`);
});
