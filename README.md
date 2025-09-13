# 🌃 PixelVault - Modern Image Gallery Platform

A full-stack image gallery application with **robust authentication**, **intuitive album management**, and **advanced search capabilities**, all wrapped in a stunning **cyberpunk-themed interface**.

🚀 **Live Demo:** [PixelVault on Render](https://pixelvault-jpy0.onrender.com/)

---

## ❓ Problem Statement

Managing digital images is often messy — scattered files, no proper albums, limited sharing, and poor search capabilities.

**PixelVault** solves this by providing a **modern, secure, and feature-rich gallery platform** where users can upload, manage, and explore images with ease.

---

## 🚀 Features

- **Authentication System**: JWT-based auth with Google OAuth support
- **Role-based Access Control**: Admin, Editor, and Visitor roles
- **Image Management**: Upload, edit, delete, and organize images
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Cyberpunk-themed interface with animations
- Secure login/logout with **JWT authentication**.
- User roles:
  - **Visitor** → View public content.
  - **Editor** → Upload & manage their content.
  - **Admin** → Full control over all content and users.

### 🖼 Image Management

- Likes ❤️ and Comments 💬 will be available **only in the image detail view** (after clicking on an image).
- 📤 Upload multiple images with drag-and-drop.
- 📝 Edit image title/caption.
- 🗑 **Delete images** (Admin/Editor).
- 📂 **Create, move, and manage albums**.
- ⬇️ **Download images** with one click.

### 🔍 Search & Explore

- Keyword search across **titles, captions, and tags**.
- Filters by **album** and **date**.

## Demo Video

- Large video wait for some time!!
- https://drive.google.com/file/d/1Cb5E3VgnyYufAXU5_zNTNwp9McNT7zDQ/view?usp=sharing

## 🛠 Tech Stack

### Backend

- Node.js + Express.js
- PostgreSQL database
- JWT authentication
- Bcrypt password hashing
- Multer file upload
- Sharp image processing

### Frontend

- React 18 + Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Responsive design

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 12+
- Git

## 🔧 Installation

- Note: This is just the proceedure , for it to actually work, u need to replace all the routes pointing to render backend to localhost:5001, so this section is just for demonstration.

### 1. Clone the Repository

```bash
git clone https://github.com/tungprogramming/Codex-Frieza-Week-2.git
cd Codex-Frieza-Week-2
```

### 2. Backend Setup

```bash
cd server
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=pixelvault

# JWT Secret (generate a long random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE pixelvault;
```

Run the database migration:

```bash
psql -U your_db_user -d pixelvault -f db.sql
```

### 4. Frontend Setup

```bash
cd ../client
npm install
```

Create frontend environment file:

```bash
echo "VITE_API_URL=http://localhost:5001" > .env
```

### 5. Start the Application

**Backend** (from `/server` directory):

```bash
npm run dev
```

**Frontend** (from `/client` directory):

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 👤 Default Users

The database migration creates these test accounts:

| Username | Email                  | Password   | Role    |
| -------- | ---------------------- | ---------- | ------- |
| admin    | admin@pixelvault.com   | admin123   | Admin   |
| editor   | editor@pixelvault.com  | editor123  | Editor  |
| visitor  | visitor@pixelvault.com | visitor123 | Visitor |

**⚠️ Change these passwords in production!**

## 📁 Project Structure

```
pixelvault/
├── server/                 # Backend API
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & validation middleware
│   ├── routes/           # API routes
│   ├── config/           # Database configuration
│   ├── uploads/          # Uploaded images
│   └── server.js         # Main server file
├── client/               # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context (state)
│   │   ├── hooks/        # Custom React hooks
│   │   └── services/     # API service classes
└── README.md
```

## 🔒 Authentication & Permissions

### Roles

- **Visitor**: Read-only access, can view public images
- **Editor**: Can upload, edit, and delete their own content
- **Admin**: Full access to all content and users

### Protected Routes

- Authentication required for `/gallery`, `/albums`, `/images/:id`
- Role-based permissions enforced on backend
- JWT tokens expire after 7 days

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Images

- `GET /api/images` - Get images with filters
- `POST /api/images` - Upload images (auth required)
- `GET /api/images/:id` - Get single image
- `PUT /api/images/:id` - Update image (auth required)
- `DELETE /api/images/:id` - Delete image (auth required)

### Albums

- `GET /api/albums` - Get all albums
- `POST /api/albums` - Create album (auth required)
- `GET /api/albums/:id` - Get album with images
- `PUT /api/albums/:id` - Update album (auth required)
- `DELETE /api/albums/:id` - Delete album (auth required)

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set strong JWT secret
4. Configure CORS for your domain
5. Use process manager (PM2)

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd client && npm run build
   ```
2. Serve the `dist` folder with your web server
3. Configure environment variables for production API

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5001
DB_HOST=your_production_db_host
JWT_SECRET=your_super_secure_production_jwt_secret
FRONTEND_URL=https://your-domain.com
```

## 🧪 Development

### Backend Development

```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

```bash
cd client
npm run dev  # Vite dev server with HMR
```

### Database Migrations

When you modify the database schema, update `db.sql` and re-run:

```bash
psql -U your_db_user -d pixelvault -f db.sql
```

## 🔧 Configuration

### File Upload Limits

- Max file size: 10MB per image
- Supported formats: JPEG, PNG, WebP, AVIF, GIF
- Automatic thumbnail generation
- EXIF data extraction

### Image Processing

- Thumbnails: 400x400px (max)
- Original images preserved
- Sharp library for fast processing

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**

```
Error: ENOTFOUND localhost
```

- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists

**JWT Secret Error**

```
Error: secretOrPrivateKey is required
```

- Set `JWT_SECRET` in `.env`
- Make it at least 32 characters long

**File Upload Error**

```
Error: ENOENT: no such file or directory, open 'uploads/...'
```

- Ensure `uploads` directory exists in server folder
- Check file permissions

**CORS Error**

```
Access to fetch at 'http://localhost:5001' from origin 'http://localhost:5173' has been blocked by CORS policy
```

- Ensure backend is running on port 5001
- Check CORS configuration in server.js

## 📖 API Documentation

Visit `http://localhost:5001/api/docs` when the server is running for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙋‍♂️ Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the logs in terminal
3. Check database connectivity
4. Verify environment variables

## 🔮 Future Features (Placeholders)

- **AI Image Generation**: Generate images using AI models
- **Custom Color Palette**: Extract and display color palettes from images
- **Vector Search**: Semantic search using image embeddings
- **Social Features**: Comments, likes, and sharing
- **Advanced EXIF**: Detailed camera metadata display
- **Cloud Storage**: AWS S3 or Cloudinary integration

---

**Happy coding! 📸✨**
