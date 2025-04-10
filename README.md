# CampusKart

CampusKart is a comprehensive campus services application for IIT Patna students, providing access to various services like food ordering, library management, laundry services, and equipment rental.

## Features

- **Restaurant**: Order food from campus eateries
- **Library**: Browse and issue books
- **Laundry**: Schedule laundry services
- **Rental**: Rent equipment and items

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd campuskart
   ```

2. Install MongoDB:

   - Download and install MongoDB Community Server from [MongoDB's official website](https://www.mongodb.com/try/download/community)
   - Create a data directory: `mkdir C:\data\db` (for Windows)
   - Start MongoDB service: `mongod --dbpath="C:\data\db"`

3. Set up the backend:

   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following content:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campuskart
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start MongoDB (if not already running):

   ```bash
   mongod --dbpath="C:\data\db"
   ```

2. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

3. Seed the database (optional):

   ```bash
   npm run seed
   ```

4. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Restaurant

- GET /api/restaurant/menu - Get all menu items
- POST /api/restaurant/order - Place an order
- GET /api/restaurant/orders - Get user's orders

### Library

- GET /api/library/books - Get all books
- GET /api/library/books/search - Search books
- POST /api/library/issue - Issue a book
- GET /api/library/my-books - Get user's issued books

### Laundry

- GET /api/laundry/items - Get all laundry items
- POST /api/laundry/order - Place a laundry order
- GET /api/laundry/orders - Get user's laundry orders

### Rental

- GET /api/rental/items - Get all rental items
- POST /api/rental/rent - Rent an item
- GET /api/rental/orders - Get user's rental orders

## Deployment

To deploy this application to Netlify:

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy the application:
```bash
npm run deploy
```

Your application will be available at a URL like `https://your-site-name.netlify.app`

## Project Structure

- `frontend/` - React frontend application
- `backend/` - Node.js backend server
- `netlify.toml` - Deployment configuration for Netlify
- `deploy.sh` - Script to automate deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IIT Patna for providing the opportunity to develop this application
- All contributors who have helped in the development process
