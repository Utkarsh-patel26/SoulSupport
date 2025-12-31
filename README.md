# SoulSupport - Online Therapy Platform

## Project Overview

**SoulSupport** is a comprehensive online therapy and mental wellness platform that connects users with licensed therapists. Built using the MindStack/MERN architecture, it provides a secure, user-friendly environment for mental health support.

## Features

### For Users

- **Therapist Discovery**: Browse and filter licensed therapists by specialization, rating, and availability
- **Session Booking**: Schedule therapy sessions with preferred therapists
- **Community Forum**: Share experiences and support others anonymously
- **Resource Library**: Access mental health guides, videos, and articles
- **Session Management**: Track upcoming and past sessions
- **Review System**: Rate and review completed sessions

### For Therapists

- **Profile Management**: Create detailed professional profiles with qualifications and specializations
- **Availability Settings**: Set working hours and available days
- **Session Management**: View and confirm booking requests
- **Client Reviews**: Receive and display client feedback
- **Dashboard Analytics**: Track sessions, ratings, and earnings

### Platform Features

- **Secure Authentication**: JWT-based authentication system
- **Real-time Notifications**: Get notified about bookings, confirmations, and cancellations
- **Email Notifications**: Automated email alerts for important events
- **File Uploads**: Profile pictures and therapist photos via Cloudinary
- **Mobile Responsive**: Fully responsive design for all devices

## Technology Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: Axios
- **Forms**: React Hook Form + Zod validation
- **Notifications**: React Hot Toast

## Project Structure

```
soulsupport/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Custom middlewares
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Request validators
│   │   ├── utils/        # Utility functions
│   │   ├── app.js        # Express app
│   │   └── server.js     # Server entry point
│   ├── tests/            # Test files
│   ├── package.json
│   └── .env.example
│
├── frontend/             # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── context/      # React Context
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   └── services/     # API services
│   ├── public/           # Static files
│   ├── package.json
│   └── .env.local.example
│
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- Cloudinary account
- Email service (Gmail or SendGrid)

### Installation

1. **Clone the repository** (or navigate to project folder):

```bash
cd d:\plan\soulsupport
```

2. **Backend Setup**:

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration (see USER_CONFIGURATION_GUIDE.md)
npm run dev
```

3. **Frontend Setup** (in a new terminal):

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
npm run dev
```

4. **Access the application**:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/health

## Configuration

### Required Environment Variables

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=SoulSupport
```

**Detailed configuration instructions**: See [USER_CONFIGURATION_GUIDE.md](USER_CONFIGURATION_GUIDE.md)

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Forum Endpoints

- `GET /api/forum/posts` - Get all posts
- `POST /api/forum/posts` - Create post
- `POST /api/forum/posts/:id/like` - Like post
- `POST /api/forum/posts/:id/comments` - Add comment

### Therapist Endpoints

- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get therapist profile
- `PUT /api/therapists/:id` - Update profile (therapist only)
- `POST /api/therapists/:id/photo` - Upload photo

### Session Endpoints

- `GET /api/sessions` - Get user/therapist sessions
- `POST /api/sessions` - Book a session
- `PUT /api/sessions/:id/status` - Update status (therapist only)
- `DELETE /api/sessions/:id` - Cancel session

### Review Endpoints

- `POST /api/reviews` - Create review
- `GET /api/reviews/therapist/:therapistId` - Get therapist reviews

For complete API documentation, see [backend/README.md](backend/README.md)

## Database Schema

### Collections

- **users** - User accounts (users and therapists)
- **therapist_profiles** - Therapist professional information
- **forum_posts** - Community forum posts with embedded comments
- **sessions** - Therapy session bookings
- **reviews** - Session reviews and ratings
- **notifications** - User notifications
- **resources** - Mental health resources

For detailed schema documentation, see architecture plan documents.

## Development Workflow

### 1. Running Development Servers

**Backend**:

```bash
cd backend
npm run dev
```

**Frontend**:

```bash
cd frontend
npm run dev
```

### 2. Testing the Application

1. Register a test user account
2. Create a therapist account (select "Therapist" during registration)
3. As therapist: Complete profile information
4. As user: Browse therapists and book a session
5. Test forum posting and community features
6. Test session management and reviews

### 3. Database Management

**View data**:

- Use MongoDB Compass or Atlas dashboard
- Connect to: `mongodb://localhost:27017/soulsupport`

**Reset database**:

```bash
# Drop all collections (be careful!)
mongosh soulsupport --eval "db.dropDatabase()"
```

## Deployment

### Production Deployment

#### Backend (Heroku, Railway, or VPS)

1. Set all environment variables
2. Use production MongoDB URI
3. Set NODE_ENV=production
4. Deploy with: `npm start`

#### Frontend (Vercel - Recommended)

```bash
vercel --prod
```

Or deploy to:

- Netlify
- AWS Amplify
- DigitalOcean App Platform

For detailed deployment instructions, see architecture plan Part 5.

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests (when implemented)

```bash
cd frontend
npm test
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error**:

- Verify MongoDB is running
- Check MONGODB_URI in .env
- For Atlas: Whitelist your IP address

**JWT Token Invalid**:

- Clear browser localStorage
- Check JWT_SECRET matches in .env
- Re-login to get new token

**CORS Errors**:

- Verify FRONTEND_URL in backend .env
- Check NEXT_PUBLIC_API_URL in frontend .env.local

**Email Not Sending**:

- For Gmail: Enable 2FA and use App Password
- Check EMAIL_USER and EMAIL_PASS in .env

For more troubleshooting help, see [USER_CONFIGURATION_GUIDE.md](USER_CONFIGURATION_GUIDE.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## Security Considerations

- Never commit .env files
- Use strong JWT secrets (minimum 32 characters)
- Keep dependencies updated
- Enable HTTPS in production
- Use environment-specific configurations
- Implement rate limiting
- Sanitize user inputs
- Hash passwords with bcrypt

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:

- Create an issue in the repository
- Check documentation in architecture plan files
- Review USER_CONFIGURATION_GUIDE.md for setup help

## Roadmap

### Phase 1 (Current - MVP)

- [x] User authentication
- [x] Therapist profiles
- [x] Session booking
- [x] Community forum
- [x] Review system

### Phase 2

- [ ] Real-time chat (Socket.io)
- [ ] Video calling integration
- [ ] Payment processing (Stripe)
- [ ] Advanced search and filters
- [ ] Admin dashboard

### Phase 3

- [ ] Mobile app (React Native)
- [ ] AI-powered therapist matching
- [ ] Analytics and reporting
- [ ] Multi-language support

## Acknowledgments

- Built following MERN/MindStack architecture principles
- Inspired by modern teletherapy platforms
- Designed for scalability and maintainability

---

**Project Status**: ✅ Core features implemented and ready for testing

**Last Updated**: December 30, 2025

**Version**: 1.0.0
