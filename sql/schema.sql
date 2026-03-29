-- ==========================================================
-- Database Initialization
-- ==========================================================
-- Create the database with full UTF-8 Unicode support
CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ==========================================================
-- Tables Creation
-- ==========================================================

-- 1. admins: Stores administrator details authenticated via Google OAuth
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  profile_pic TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for fast authentication lookups
  INDEX idx_google_id (google_id),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. sections: Configuration for dynamic homepage generic sections
CREATE TABLE IF NOT EXISTS sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_name VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  badge VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. projects: Stores portfolio projects and related details
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  preview_image TEXT,
  animation_type VARCHAR(100) DEFAULT 'fade-up',
  tech_stack VARCHAR(255),
  github_link VARCHAR(255),
  live_link VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexing display_order to optimize fetching sorted projects lists efficiently 
  INDEX idx_display_order (display_order),
  INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. blogs: Stores articles written by authorized admins
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Key constraint mapping to admins table
  CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) 
    REFERENCES admins(id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
    
  -- Indexing created_at to easily fetch blogs in chronological sorting
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. reviews: Stores user/client testimonials and ratings
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. education: Academic timeline management
CREATE TABLE IF NOT EXISTS education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  degree VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. experience: Professional work history management
CREATE TABLE IF NOT EXISTS experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. contacts: Stores contact form submissions from the site
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Index to support chronological retrieval of unread queries or recent contacts
  INDEX idx_contact_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. site_stats: Tracks overall website statistics (visits, etc)
CREATE TABLE IF NOT EXISTS site_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stat_name VARCHAR(100) UNIQUE NOT NULL,
  stat_value INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. daily_visits: Tracks website traffic per day
CREATE TABLE IF NOT EXISTS daily_visits (
  visit_date DATE PRIMARY KEY,
  count INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Sample Seed Data (For Testing/Initialization)
-- ==========================================================

-- Seed Initial Stats
INSERT IGNORE INTO site_stats (stat_name, stat_value) VALUES ('total_visits', 0);

-- Seed Section Data
INSERT IGNORE INTO sections (section_name, title, content, is_active) VALUES
('hero', 'Welcome to My Portfolio', 'I am a passionate Full Stack Developer building dynamic web applications.', TRUE),
('about', 'About Me', 'I specialize in Node.js, Express, and React.', TRUE);

-- Seed Sample Project
INSERT IGNORE INTO projects (name, short_description, full_description, animation_type, tech_stack, github_link, live_link, is_featured, display_order) VALUES
('Portfolio V1', 'My first portfolio website', 'A fully dynamic portfolio site utilizing a custom Node.js architecture.', 'fade-right', 'HTML, CSS, JS, Node.js, MySQL', 'https://github.com/Mr-Ali01/samir-ali-portfolio', 'http://localhost:5000', TRUE, 1);
