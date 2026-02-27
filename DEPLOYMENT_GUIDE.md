# SoulSupport - Complete Deployment Guide

This guide covers everything needed to run, test, and deploy the SoulSupport application using the MindStack/MERN architecture.

## Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org))
- **MongoDB** 6+ (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Docker & Docker Compose** (For containerized deployment)
- **Git** (Version control)
- **npm or yarn** (Package managers)

## Local Development Setup

### 1. Environment Setup

**Backend:**

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your values
```

**Frontend:**

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your API URL
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Start Development Servers

**Option A: Separate Terminals**

Terminal 1 - Backend:

```bash
cd backend
npm run dev
# Server runs on http://localhost:5007
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

**Option B: Using Docker Compose (Recommended)**

```bash
docker-compose up -d
# MongoDB: localhost:27017
# Redis: localhost:6379
# Backend: localhost:5007
# Frontend: localhost:3000
# Nginx: localhost:80, localhost:443
```

### 4. Database Setup

**First Time Only:**

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/soulsupport

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.therapistprofiles.createIndex({ user: 1 }, { unique: true })
db.forumposts.createIndex({ category: 1, createdAt: -1 })
db.sessions.createIndex({ therapist: 1, date: 1 })
```

## Running Tests

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage     # With coverage report
npm test -- --watch        # Watch mode
```

### Frontend Tests

```bash
cd frontend
npm test                    # Run all tests
npm test -- --coverage     # With coverage report
npm test -- --watch        # Watch mode
```

## Building for Production

### Backend

```bash
cd backend
npm run build  # If you have a build script
npm install --production  # Install only production deps
```

### Frontend

```bash
cd frontend
npm run build
npm install --production
```

## Deployment Options

### Option 1: Traditional Server (DigitalOcean, AWS, Linode)

**1. Server Setup:**

```bash
# SSH into your server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install MongoDB (or use MongoDB Atlas)
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**2. Clone Repository:**

```bash
cd ~
git clone https://github.com/yourusername/soulsupport.git
cd soulsupport
```

**3. Setup Backend:**

```bash
cd backend
cp .env.example .env
nano .env  # Edit with your settings
npm install
npm run build

# Start with PM2
pm2 start src/server.js --name "soulsupport-api" --env production
pm2 save
```

**4. Setup Frontend:**

```bash
cd ../frontend
cp .env.example .env.local
nano .env.local  # Edit with your settings
npm install
npm run build

# Start with PM2
pm2 serve out/ --name "soulsupport-web" --spa
pm2 save
```

**5. Nginx Configuration:**

```bash
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

**6. SSL Certificate (Let's Encrypt):**

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Docker Deployment

**1. Build Images:**

```bash
docker build -t soulsupport-api ./backend
docker build -t soulsupport-web ./frontend
```

**2. Run with Docker Compose:**

```bash
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**3. Production Considerations:**

```bash
# Update docker-compose.yml for production:
# - Change NODE_ENV to production
# - Use external MongoDB (MongoDB Atlas)
# - Use external Redis
# - Set proper secrets in .env
# - Enable SSL/TLS certificates
```

### Option 3: Cloud Platforms

**Vercel (Recommended for Frontend):**

```bash
npm install -g vercel
vercel --prod
```

**Heroku:**

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Create app
heroku create soulsupport-api
heroku addons:create mongolab

# Deploy
git push heroku main
```

**Railway or Render:**

- Connect GitHub repository
- Set environment variables
- Auto-deploy on push

## Environment Variables

See `.env.example` files in backend and frontend directories for complete list.

**Critical Production Variables:**

```env
NODE_ENV=production
JWT_SECRET=your-super-strong-secret-key-min-32-chars
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/soulsupport
FRONTEND_URL=https://yourdomain.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Monitoring & Maintenance

### Logs

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Using PM2
pm2 logs
pm2 logs api
```

### Database Backups

```bash
# MongoDB backup
mongodump --db soulsupport --out ./backups/$(date +%Y%m%d)

# MongoDB restore
mongorestore --db soulsupport ./backups/20240101/soulsupport/
```

### Health Checks

```bash
curl http://localhost:5007/health     # Backend health
curl http://localhost:3000            # Frontend health
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Backup database regularly
- [ ] Set up monitoring and alerting
- [ ] Keep dependencies updated (`npm audit fix`)

## Troubleshooting

**Port Already in Use:**

```bash
# Kill process on port
lsof -i :5007
kill -9 <PID>

# Or use different port
PORT=5008 npm run dev
```

**MongoDB Connection Failed:**

```bash
# Check if MongoDB is running
mongosh

# If not, start it
sudo systemctl start mongod
```

**CORS Errors:**

- Verify FRONTEND_URL matches your domain
- Check CORS configuration in backend/src/config/security.js

**Out of Memory:**

- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run dev`
- Check for memory leaks in logs

## Performance Optimization

1. **Enable Gzip Compression:**
   - Already configured in nginx.conf

2. **Database Indexing:**
   - Indexes created automatically on startup
   - Monitor query performance in MongoDB Atlas

3. **Caching:**
   - Redis configured in docker-compose.yml
   - React Query handles client-side caching

4. **Image Optimization:**
   - Using Cloudinary for image delivery
   - Next.js Image component for automatic optimization

5. **Code Splitting:**
   - Next.js automatically code-splits pages
   - Configure `next/dynamic` for large components

GitHub Actions workflow configured in `.github/workflows/ci-cd.yml`

Automatically:

- Runs tests on pull requests
- Builds Docker images
- Pushes to container registry
- Deploys to production (on merge to main)

## Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com
- **Docker Docs:** https://docs.docker.com
- **Nginx Docs:** https://nginx.org/en/docs

## License

MIT License - See LICENSE file for details
