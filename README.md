# Flavour Food - Full-Stack Food Delivery Application

Flavour Food is a full-stack food delivery application that allows users to browse food items, add products to the cart, place orders, and make secure online payments. The application is designed to provide a smooth and responsive user experience with a scalable backend architecture and secure payment processing.

## 🛠Tech Stack

### Frontend
- React.js
- Axios
- CSS / Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB/Mongoose

### Authentication
- JWT Authentication
- BcryptJS

### Payment Integration
- Razorpay

### Deployment
- Frontend: Vercel
- Backend: Render

## 🚀Features

- User registration and login
- JWT-based authentication and protected routes
- Browse food items and categories
- Add and remove items from cart
- Place food orders
- Secure payment gateway integration with Razorpay
- Order confirmation and verification
- Responsive design for desktop and mobile
- REST APIs for authentication, products, cart, and orders

## 🔥Key Contributions

- Developed 10+ REST APIs using Node.js and Express.js
- Implemented secure password hashing using BcryptJS
- Integrated JWT authentication for secure user sessions
- Built responsive React components for menu browsing and checkout flow
- Connected Razorpay payment gateway for secure online transactions
- Used MongoDB for storing user, product, cart, and order data

## 📁Project Structure

- frontend/src/components → Reusable UI components
- frontend/src/pages → Application pages
- frontend/src/context → Global state management
- frontend/src/assets → Images and static files
- backend/routes → API route handlers
- backend/controllers → Business logic
- backend/models → MongoDB models
- backend/middleware → Authentication and validation

## 📦Installation

### Clone the repository

- git clone <your-repository-url>
- cd Flavour-Food

### Frontend Setup
- cd frontend
- npm install
- npm run dev

### Backend Setup
- cd backend
- npm install
- npm start

## 🔐Environment Variables

### Create a .env file inside the backend folder and add the following:
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- RAZORPAY_KEY_ID=your_razorpay_key_id
- RAZORPAY_KEY_SECRET=your_razorpay_secret

#### The following files should not be pushed to GitHub:
- .env
- .env.local
- .env.production

#### Add these lines to your .gitignore file:
- .env
- .env.*
- !.env.example

## 🌐Deployment

### The project can be deployed using:
- Frontend → Netlify or Vercel
- Backend → Render or Railway

Whenever new changes are pushed to the main branch, the deployed version can be updated automatically through connected GitHub integrations.

## 💼Author

🚀 G Prasant MERN Stack Developer