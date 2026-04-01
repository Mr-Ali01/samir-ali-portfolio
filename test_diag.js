const db = require('./src/config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function runDiagnostics() {
    console.log('--- DIAGNOSTICS START ---');
    
    // 1. Test Database
    try {
        console.log('Testing DB Query...');
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('✅ DB Query OK:', rows[0].result);
        
        console.log('Checking "contacts" table structure...');
        const [tableInfo] = await db.query('DESCRIBE contacts');
        console.log('✅ "contacts" table exists and is accessible.');
    } catch (err) {
        console.error('❌ DB Error:', err.message);
    }
    
    // 2. Test SMTP
    try {
        console.log('Testing SMTP connection...');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        await transporter.verify();
        console.log('✅ SMTP Connection verified successfully.');
    } catch (err) {
        console.error('❌ SMTP Error:', err.message);
    }
    
    console.log('--- DIAGNOSTICS END ---');
    process.exit(0);
}

runDiagnostics();
