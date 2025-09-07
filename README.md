Modern Image Gallery Application
A full-stack, modern, and extensible image gallery web application built to replace a legacy PHP system. It features a secure Node.js backend API and a dynamic React frontend.

🌟 Core Features
Secure User Authentication: Full user registration and login system using JWT for secure sessions.

Modern Uploader: Drag-and-drop file uploader with support for multiple images.

Image Processing: Automatic thumbnail generation and EXIF data extraction on the server side.

Content Management: Create, view, and manage albums to organize images.

Privacy Controls: Set images as public, private, or unlisted.

Responsive Design: A beautiful, responsive UI that works on all devices.

Scalable Architecture: A decoupled frontend and backend for better maintainability and scalability.

🛠️ Tech Stack
Backend: Node.js, Express.js

Frontend: React (with Vite)

Database: PostgreSQL

Authentication: JSON Web Tokens (JWT)

Image Handling: Multer for uploads, Sharp for processing

Styling: (Planned) Tailwind CSS for the frontend

🚀 Getting Started
Follow these instructions to get the project running on your local machine for development and testing.

Prerequisites
Node.js (v18 or later)

npm or yarn

PostgreSQL installed and running

A code editor like VS Code

1. Clone the Repository
   git https://github.com/tung-programming/Codex-Frieza-Week-2
   cd root-directory name

2. Backend Setup (server/)
   Navigate to the server directory:

cd server

Install dependencies:

npm install

Set up the database:

Connect to your PostgreSQL instance using a tool like pgAdmin.

Create a new database (e.g., image_gallery_db).

Run the SQL script located at server/models/db.sql to create all the necessary tables.

Create and configure the environment file:

Create a file named .env in the server/ directory.

Copy the contents from the example below and replace the placeholders with your actual database credentials.

# Server Port

PORT=5001

# Database Connection (PostgreSQL)

DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=image_gallery_db
DB_PASSWORD=your_db_password
DB_PORT=5432 # Or the port your DB is running on

# JWT Secret Key (generate a long, random string)

JWT_SECRET=your_super_secret_jwt_key

Run the backend server:

npm run dev

The API will be running at http://localhost:5001.

3. Frontend Setup (client/)
   Open a new terminal window.

Navigate to the client directory:

cd client

Install dependencies:

npm install

(Optional) Create an environment file: If your API is running on a different URL in production, you can create a .env file in the client/ directory.

VITE_API_URL=http://localhost:5001

Run the frontend development server:

npm run dev

The application will open in your browser, usually at http://localhost:5173.

📄 License
This project is open-source and licensed under the MIT License. See the LICENSE file for more details.
