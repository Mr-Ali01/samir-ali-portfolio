# 🚀 Full Stack Portfolio Website (Node.js without Express)

A dynamic **full-stack portfolio website** built using **HTML, CSS,Tailwind CSS, JavaScript, Node.js (core HTTP module), and MySQL**.

This project demonstrates deep backend understanding by implementing **custom routing, request handling, and API logic without using any framework like Express.js**.

---

## 📌 Overview

This is not a static portfolio — it is a **fully dynamic, database-driven system** where all content is managed via an **admin dashboard**.

* 🔄 Dynamic content rendering (projects, blogs, sections)
* 🔐 Google OAuth authentication (admin)
* ⚙️ Custom REST API implementation (without Express)
* 🗄️ MySQL database integration
* 🎨 Scroll animations (AOS)

---

## 🏗️ Architecture

### 📌 Current Architecture: Monolithic (Custom Node.js Server)

```id="1y3ghm"
Client (Browser)
      ↓
Node.js (HTTP Module - Custom Server)
      ↓
MySQL Database
```

* No framework (no Express)
* Manual routing using `http` module
* Manual request parsing and response handling

---

## 🧠 Why No Express?

This project intentionally avoids Express to:

* Understand **core backend fundamentals**
* Implement **manual routing and middleware logic**
* Gain deeper knowledge of how frameworks work internally

---

## 🛠️ Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Frontend  | HTML, CSS,Tailwind CSS, JavaScript   |
| Backend   | Node.js (HTTP module)   |
| Database  | MySQL                   |
| Auth      | Google OAuth            |
| Animation | AOS (Animate on Scroll) |

---

## ✨ Features

### 👤 User Features

* View portfolio homepage
* Browse projects
* Read blogs
* View testimonials
* Contact via form

### 🔐 Admin Features

* Google authentication login
* Manage:

  * Projects (CRUD)
  * Blogs (CRUD)
  * Reviews (CRUD)
  * Sections (dynamic homepage)
* View contact messages

---

## 🏠 Home Page Sections

* Hero Section
* About Preview
* Skills
* Services
* Featured Projects
* Latest Blogs
* Testimonials
* Contact CTA

> All sections are dynamically controlled via the database.

---

## 🗄️ Database Schema

Main tables:

* `admins` → Google authentication
* `projects` → Portfolio data
* `blogs` → Articles
* `reviews` → Testimonials
* `contacts` → Messages
* `sections` → Dynamic homepage content

---

## 🔗 API Endpoints (Custom Implementation)

All APIs are manually implemented using Node.js `http` module.

### 🔐 Authentication

* `GET /api/auth/google`
* `GET /api/auth/google/callback`
* `GET /api/auth/logout`

### 💼 Projects

* `GET /api/projects`
* `POST /api/projects`
* `PUT /api/projects/:id`
* `DELETE /api/projects/:id`

### 📝 Blogs

* `GET /api/blogs`
* `POST /api/blogs`
* `PUT /api/blogs/:id`
* `DELETE /api/blogs/:id`

### ⭐ Reviews

* `GET /api/reviews`
* `POST /api/reviews`
* `DELETE /api/reviews/:id`

### 📩 Contacts

* `POST /api/contacts`
* `GET /api/contacts`
* `DELETE /api/contacts/:id`

### 🧩 Sections

* `GET /api/sections`
* `POST /api/sections`
* `PUT /api/sections/:id`
* `DELETE /api/sections/:id`

---

## 📁 Project Structure

```id="t3ydba"
My-Portfolio/
│
├── server.js              # Core HTTP server
├── .env
├── package.json
│
├── db/
│   └── connection.js      # MySQL connection
│
├── public/                # Frontend files
│   ├── index.html
│   ├── projects.html
│   ├── blog.html
│   ├── contact.html
│   ├── admin.html
│   ├── css/
│   └── js/
│
└── sql/
    └── schema.sql
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```id="ldm2bo"
git clone https://github.com/Mr-Ali01/samir-ali-portfolio.git
cd My-Portfolio
```

---

### 2️⃣ Install Dependencies

```id="8c9vns"
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file:

```id="4dsz5f"
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=portfolio_db

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

---

### 4️⃣ Run Server

```id="i9moyn"
node server.js
```

Server runs on:

```id="xqg0ua"
http://localhost:5000
```

---

## 🔄 Data Flow

```id="y6dcw0"
Frontend (fetch API)
        ↓
Node.js (Custom HTTP Server)
        ↓
MySQL Database
        ↓
JSON Response
        ↓
Dynamic UI Rendering
```

---

## 🔐 Authentication Flow

1. User clicks "Login with Google"
2. Google returns user data
3. Backend checks/inserts admin
4. Session is created

---

## ⚠️ Challenges Solved

* Manual routing without Express
* Manual request body parsing
* CORS handling
* Authentication integration
* Dynamic UI rendering

---

## 🚀 Deployment

* **Frontend:** Netlify / GitHub Pages
* **Backend:** Render / Railway
* **Database:** Railway MySQL / PlanetScale

---

## 🔮 Future Enhancements

* Refactor to Express.js + MVC architecture
* Add JWT authentication
* Add file/image upload
* Add pagination & filtering
* Improve performance and caching

---

## 🎯 Learning Outcomes

* Deep understanding of Node.js core modules
* Manual REST API implementation
* Backend fundamentals without frameworks
* Database integration
* Full-stack system design

---

## 💡 Interview Explanation

> Built a full-stack portfolio using Node.js core HTTP module without Express, implementing custom routing, request handling, and REST APIs. Integrated MySQL for dynamic content and Google OAuth for authentication.

---

## 📌 Conclusion

This project demonstrates:

✔ Strong backend fundamentals
✔ Full-stack development skills
✔ Real-world system design
✔ Ability to work without frameworks

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
