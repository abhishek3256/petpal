# PetPal - Pet Marketplace

A full-stack pet marketplace built with React, Node.js, Express, and MongoDB. Users can buy/sell pets, book veterinary appointments, hire pet walkers, and shop for pet accessories.

## Features

- **Pet Adoption**: Browse and purchase pets from sellers
- **Veterinary Services**: Book appointments with veterinarians
- **Pet Walking**: Hire professional pet walkers
- **Pet Daycare**: Book daycare services for pets
- **Pet Accessories**: Shop for pet supplies and accessories
- **User Management**: Multiple user roles (buyer, seller, walker, daycare, vet, admin)
- **Admin Panel**: Manage users and orders
- **Authentication**: JWT-based authentication with role-based access
- **Responsive Design**: Modern UI with bright colors and gradients

## Tech Stack

### Frontend
- React 18 with Vite
- React Router DOM for navigation
- React Toastify for notifications
- Axios for API calls
- CSS with gradients and modern styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Cookie-parser for session management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**

   **Backend (.env file in server directory)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pet-marketplace
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

   **Frontend (.env file in client directory)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:5000)

## User Roles

### Buyer
- Browse and purchase pets
- Buy pet accessories
- Book veterinary appointments
- Hire pet walkers
- Book daycare services

### Seller
- List pets for sale
- Manage pet listings
- View sales history

### Pet Walker
- Set hourly rates
- Accept walking jobs
- Manage appointments

### Pet Daycare
- Set hourly rates
- Accept daycare bookings
- Manage appointments

### Veterinarian
- Set hourly rates
- Accept appointment bookings
- Manage veterinary services

### Admin
- Manage all users
- View all orders
- Update order statuses
- Activate/deactivate users

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Pets
- `GET /api/pets` - Get all available pets
- `POST /api/pets` - Add new pet (seller only)
- `GET /api/pets/my-pets` - Get seller's pets
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Accessories
- `GET /api/accessories` - Get all accessories
- `POST /api/accessories` - Add accessory (admin only)
- `PUT /api/accessories/:id` - Update accessory
- `DELETE /api/accessories/:id` - Delete accessory

### Services
- `GET /api/vets` - Get all veterinarians
- `GET /api/walkers` - Get all pet walkers
- `GET /api/daycare` - Get all daycare services

### Orders
- `POST /api/orders/pet` - Purchase pet
- `POST /api/orders/accessory` - Purchase accessory
- `POST /api/orders/service` - Book service
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/my-sales` - Get seller's sales
- `PUT /api/orders/:id/status` - Update order status

## Deployment to Vercel

### Frontend Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Connect your GitHub repository
   - Import the project
   - Configure as Vite app
   - Set environment variable: `VITE_API_BASE_URL` to your backend URL

### Backend Deployment

1. **Create separate repository for backend**
   ```bash
   mkdir pet-marketplace-backend
   cd pet-marketplace-backend
   # Copy server files
   git init
   git add .
   git commit -m "Backend initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Create new Vercel project
   - Connect backend repository
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `PORT`: 5000

3. **Update Frontend API URL**
   - Update `VITE_API_BASE_URL` in frontend environment to your backend Vercel URL

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-marketplace
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Project Structure

```
pet-marketplace/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js app
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── package.json
│   └── index.js
├── package.json           # Root package.json
└── README.md
```

## Features Implemented

- ✅ User registration and login with JWT
- ✅ Role-based authentication
- ✅ Pet listing and purchasing
- ✅ Accessory shopping
- ✅ Veterinary appointment booking
- ✅ Pet walking service booking
- ✅ Pet daycare service booking
- ✅ Admin panel for user and order management
- ✅ Toast notifications for all actions
- ✅ Responsive design with bright colors
- ✅ Social media links (refresh functionality)
- ✅ Centralized image and link management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 