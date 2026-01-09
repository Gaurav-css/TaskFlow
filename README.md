 - Premium Task Management Web App

![MiniTask Banner](https://via.placeholder.com/1200x400?text=MiniTask+Dashboard)

## 🚀 Overview

**MiniTask** is a modern, full-stack Task Management application built with performance, security, and scalability in mind. It uses a **Next.js** frontend with a premium, animated UI and a robust **Node.js/Express** backend secured with enterprise-grade practices.

### Key Features
- **✨ Premium UI/UX**: Interactive Canvas animations (Snow/Cursor effects), dark mode, and smooth **Framer Motion** transitions.
- **🔐 Secure Authentication**: JWT-based auth, secure cookies/localStorage, Password Hashing (Bcrypt), and **Forgot Password** flow powered by **Mailjet**.
- **🛡️ Enterprise Security**: Rate Limiting, Helmet Headers, Input Sanitization (Express-Validator), and strict CORS policies.
- **⚡ Real-time Interactivity**: Dynamic task management (Drag & Drop feel), automated status updates, and interactive checklists.
- **📱 Fully Responsive**: Optimized for Mobile, Tablet, and Desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: **Framer Motion** (for shared layout & entrance animations)
- **State**: React Context API
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: Helmet, Rate-Limit, Bcrypt, JWT
- **Email Server**: **Mailjet** (Node-Mailjet SDK)
- **Language**: TypeScript

---

## 📂 Project Structure (Modularity)

The codebase follows a strict MVC and Component-based architecture for maximum modularity and scalability.

```
/
├── frontend/           # Next.js Application
│   ├── src/app/        # Pages & Routing
│   ├── src/components/ # Reusable UI Components
│   └── ...
│
├── backend/            # Express API
│   ├── src/controllers/# request logic
│   ├── src/models/     # DB Schemas
│   ├── src/routes/     # API Endpoints
│   ├── src/middleware/ # Security & Auth logic
│   └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Instance (Local or Atlas)
- Mailjet API Keys (for email features)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/taskflow.git
    cd taskflow
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create .env file
    # PORT=5000, MONGO_URI=..., JWT_SECRET=..., MAILJET_API_KEY=...
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    # Create .env file
    # NEXT_PUBLIC_API_URL=http://localhost:5000/api
    npm run dev
    ```

4.  **Access App**
    Open [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

Detailed documentation on specific aspects of the project:

- [**Code Quality & Standards**](./CODE_QUALITY.md): Coding practices, linting, and architecture.
- [**Scaling Strategy**](./SCALING.md): How to scale this app for millions of users.
- [**API Documentation**](./API_DOCUMENTATION.md): Complete API reference.
