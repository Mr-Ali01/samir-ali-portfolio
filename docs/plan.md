# Production-Ready Full-Stack Portfolio Architecture Plan

This plan outlines the architecture, structure, and development strategy for a production-grade, monolithic full-stack portfolio application. It builds upon the core requirements defined in the single source of truth (`README.md`), incorporating modern best practices, scalability enhancements (such as migrating to Express.js and implementing JWT), and robust security measures.

## 1. System Architecture

### Monolithic Design Overview
The system follows a **monolithic architecture** where both the frontend service (serving static assets) and the backend API reside within the same unified codebase and deployment pipeline. 
* **Frontend**: HTML, CSS, Tailwind CSS, Vanilla JavaScript, and AOS for animations.
* **Backend**: Node.js integrated with Express.js to enhance routing, middleware support, and maintainability (fulfilling the *Future Enhancements* requirement).
* **Database**: MySQL as the relational database, utilizing a connection pool to optimize query performance.

### Technology Stack Selection
* **Frontend**: HTML5, CSS3, Tailwind CSS (for scalable, utility-first styling), JavaScript (ES6+), AOS.
* **Backend**: Node.js, Express.js (for robust routing and MVC architecture).
* **Database**: MySQL (PlanetScale/Railway for cloud hosting).
* **Authentication**: Google OAuth combined with JWT (JSON Web Tokens) for stateless session management.
* **Security & Optimization**: Helmet.js (HTTP headers), express-rate-limit, CORS, dotenv.

### High-level Data Flow & Component Interaction
1. **Client Request**: User interacts with the UI (e.g., viewing projects, submitting contact form, or Admin Google Login).
2. **API Layer**: Requests hit the Node/Express backend. Middleware handles CORS, rate-limiting, authentication (JWT validation), and payload json parsing.
3. **Service Layer**: Controllers map requests to specific services containing the core business logic.
4. **Data Access Layer**: Services interact with the MySQL database via the Repository pattern to execute CRUD operations safely.
5. **Response**: JSON payloads or static assets are returned to the client for dynamic DOM updates or rendering.

## 2. Project Structure

A clean, scalable layer-based folder structure enforcing **Separation of Concerns**:

```text
My-Portfolio/
├── src/
│   ├── config/           # Environment, DB, and external service configurations
│   ├── controllers/      # Route handlers mapping requests to services
│   ├── middlewares/      # Auth, validation, error handling, rate limiting
│   ├── models/           # Database schemas/types (or object blueprints)
│   ├── repositories/     # Database interaction logic (SQL queries)
│   ├── routes/           # API route definitions
│   ├── services/         # Core business and application logic
│   └── utils/            # Helper functions (e.g., JWT signing, formatting)
├── public/               # Static frontend assets
│   ├── css/              # Tailwind and custom CSS styles
│   ├── js/               # Frontend scripts (API consumption, DOM manipulation)
│   ├── index.html        # Main landing page
│   └── admin.html        # Admin dashboard
├── docs/                 # Documentation files
├── .env                  # Environment Variables
├── .gitignore            # Git ignored files
├── package.json          # Dependencies and scripts
└── server.js             # Application entry point
```

## 3. Backend Design

### Secure REST API Architecture
Transition from manual `http` module handling to Express.js. Routes are strictly versioned (e.g., `/api/v1/projects`) and follow RESTful principles.

### Input Validation & Sanitization
* Use validation libraries like `Joi` or `express-validator` to strict-check request payloads in middlewares before hitting controllers.
* Sanitize inputs to strip out executable scripts/tags preventing Stored XSS.

### Centralized Error Handling
* Implement a global error-handling middleware (`(err, req, res, next)`) to catch asynchronous errors, unexpected exceptions, and send standardized JSON error responses (e.g., `{ success: false, error: "Not Found", status: 404 }`).
* Log critical errors utilizing tools like `Winston` or `Morgan`.

### Rate Limiting & Security Best Practices
* Implement `express-rate-limit` on all API endpoints to prevent DDoS and Brute Force attacks. Apply stricter limits on authentication endpoints (`/api/v1/auth`).
* Enforce CORS policies allowing only specific trusted origins in production.

### JWT-Based Authentication & Role-Based Authorization
* **Authentication**: Google OAuth validates user identity. Node issues a secure JWT sent back to the client.
* **Authorization**: Implement an `isAdmin` middleware that decodes the JWT on protected routes (CRUD operations for projects, blogs, sections), avoiding manual DB session lookups.

## 4. Frontend Architecture

### Component Structure & State Management
* Apply a modular Vanilla JS script approach (e.g., `projects.js`, `contact.js`, `api.js`). 
* Manage state by preserving a structured JSON object in app memory.
* Selectively update DOM trees targeting specific container IDs (e.g., `#projects-container`).

### API Integration Strategy
* Create a generic `apiClient.js` utility wrapper around `fetch()`. It will centralize the configuration of base URLs, attachment of Authorization headers (JWT), and global fetch error handling.

### Reusable UI Design Principles
* Emphasize the **Utility-First** approach using Tailwind CSS. 
* Standardize UI elements (cards, buttons, forms, typographies) to ensure consistency across public-facing sections and the admin dashboard. 
* Add AOS (Animate on Scroll) tags consistently for smooth content reveals.

## 5. Authentication & Authorization

### Flow (Signup / Login / Logout)
1. **Login Workflow**: Admin clicks "Login with Google". Request triggers Google OAuth.
2. **Callback Handling**: Google returns profile info. Backend checks the `admins` table. If the email exists, proceed; otherwise, deny access or restrict to standard user.
3. **Token Handling**: Backend generates an access JWT and optional refresh token containing admin identity and role data.
4. **Session Mechanism**: JWT is stored securely as an `httpOnly` secure cookie.
5. **Logout Flow**: Clear the `httpOnly` cookie server-side, effectively terminating the active token validity for the client.

### Role-Based Access Control (RBAC)
* **Guest User**: Can perform `GET` requests on `/projects`, `/blogs`, `/reviews`, `/sections`, and `POST` to `/contacts`.
* **Admin User**: Protected by JWT validation. Allowed full `GET/POST/PUT/DELETE` privileges across all database tables.

## 6. Database Design

*Utilizing MySQL relational database via a centralized connection pool to handle concurrent operations.*

### Complete Schema Design

**1. `admins`** (Admin Authentication Table)
* `id` (INT, PK, Auto Increment)
* `google_id` (VARCHAR, Unique)
* `email` (VARCHAR, Unique)
* `name` (VARCHAR)
* `created_at` (TIMESTAMP)

**2. `sections`** (Dynamic Homepage Layout Control)
* `id` (INT, PK, Auto Increment)
* `section_name` (VARCHAR, Unique)
* `is_active` (BOOLEAN)
* `content_json` (JSON) - Stores dynamic generic content configuration

**3. `projects`**
* `id` (INT, PK, Auto Increment)
* `title` (VARCHAR)
* `description` (TEXT)
* `image_url` (VARCHAR)
* `github_url` (VARCHAR)
* `live_url` (VARCHAR)
* `created_at` (TIMESTAMP)

**4. `blogs`**
* `id` (INT, PK, Auto Increment)
* `title` (VARCHAR)
* `content` (LONGTEXT)
* `author_id` (INT, FK -> admins.id)
* `published_at` (TIMESTAMP)

**5. `reviews`**
* `id` (INT, PK, Auto Increment)
* `reviewer_name` (VARCHAR)
* `rating` (INT)
* `review_text` (TEXT)
* `created_at` (TIMESTAMP)

**6. `contacts`**
* `id` (INT, PK, Auto Increment)
* `name` (VARCHAR)
* `email` (VARCHAR)
* `message` (TEXT)
* `status` (ENUM: 'unread', 'read')
* `created_at` (TIMESTAMP)

### Indexing & Optimization Considerations
* Add Indexes on highly queried identification fields: `email` and `google_id` in the `admins` table to accelerate authentication sequences.
* Keep indexing light to prioritize read operations: index `published_at` on `blogs` for efficient chronological querying.

## 7. Security Considerations

* **XSS (Cross-Site Scripting)**: Sanitize string inputs from `contacts`, `projects`, and `blogs` on the backend before writing to the database. Render variables safely on the DOM preventing JS execution.
* **CSRF (Cross-Site Request Forgery)**: Implement `SameSite=Strict` cookie attributes for the JWT session cookies to prevent third-party malicious requests.
* **SQL Injection**: Strictly implement PreparedStatement (parameterized queries) using the `mysql2` package for *all* database interactions. Zero direct string interpolation in SQL clauses.
* **Secure Headers**: Attach `Helmet.js` to safeguard against vulnerabilities by applying best practice HTTP headers including HSTS and X-Frame-Options.

## 8. Environment & Configuration

Environment configurations mapped abstractly using `dotenv`.

### Environment Variables Structure
```env
# Application Context
PORT=5000
NODE_ENV=development # or production

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=portfolio_db

# Google OAuth Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secrets
JWT_SECRET=super_secret_jwt_signature_key
JWT_EXPIRES_IN=1d

# Frontend Connectivity
ALLOWED_ORIGIN_URL=http://localhost:5000
```
*Note: A `.env.example` dummy file will be maintained within version control.*

## 9. Deployment Strategy

### Production Build Process
* As a non-compiled Node environment, no heavy build pipeline is required.
* Ensure packages are installed securely via `npm ci` (respecting package-lock constraints) and avoiding `devDependencies`.
* Execution command: `node server.js`.

### Hosting Recommendations
* **Backend + Frontend**: Deploy the entire monolithic Node instance cleanly on **Render**, **Railway**, or **Heroku**. (Since the node engine natively serves the `public/` directory, one instance drives both the API block and the frontend files).
* **Database**: Utilize managed MySQL clusters (e.g., **PlanetScale** or **Railway MySQL**) integrated directly with the backend via secure connection strings.

### CI/CD Considerations
* **GitHub Actions Workflows**: Trigger pipelines on PRs and merges into `main`:
  1. *Test*: Perform linting and run standard unit tests if integrated.
  2. *Build*: Install dependencies (`npm ci`).
  3. *Deploy*: Automatically dispatch the deployment hook directly to the cloud platform (Render/Railway).

## 10. Development Workflow

### Coding Standards & Best Practices
* Add **ESLint** and **Prettier** to standardize the codebase format globally.
* Architect lightweight controllers. Map heavy processing directly to the `services` logic.
* Consistently utilize uniform asynchronous behavior (`async/await`) encased internally with appropriate `try...catch` error handling structures.

### Git Workflow & Versioning Strategy
* Utilize **Feature Branching**:
  * Format: `feature/<feature-name>`, `bugfix/<bug-name>`, `hotfix/<critical-fix>`.
* Commit standard conventionally: `feat: add jwt auth`, `fix: parameterize section queries`, `docs: update readme structure`.
* Protected `main` branch: Changes enter `main` exclusively through Pull Requests after mandatory code review.
