# 🎬 OhnoMovies - Complete Ticket Booking System

A production-ready movie ticket booking application with **Angular**, **Spring Boot**, deployed on **AWS EC2** using **Docker**, **Terraform**, and **GitHub Actions CI/CD**.

[![CI/CD Pipeline](https://github.com/n1shan1/ohnomovies/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/n1shan1/ohnomovies/actions/workflows/ci-cd.yml)

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
./setup.sh
```

### Option 2: Manual Docker Compose
```bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Access application
# Frontend: http://localhost
# Backend:  http://localhost:4000/api/v1
```

### Option 3: AWS Deployment with Terraform
```bash
cd terraform
terraform init
terraform apply
# Then configure GitHub Actions for automated deployments
```

---

## 📚 Documentation

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview and architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[README.md](README.md)** - API documentation (existing)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         GitHub                               │
│                    (Source Control)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Push to main/master
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions                            │
│           (CI/CD Pipeline - 4 Jobs)                          │
│  ┌─────────┐  ┌────────┐  ┌─────────┐  ┌──────────────┐   │
│  │  Test   │→ │ Build  │→ │ Deploy  │  │ Security Scan│   │
│  └─────────┘  └────────┘  └─────────┘  └──────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Deploy
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                          │
│                  (Ubuntu 22.04 LTS)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Docker Compose                           │  │
│  │                                                       │  │
│  │  ┌────────────┐  ┌──────────┐  ┌────────────────┐  │  │
│  │  │  Frontend  │  │ Backend  │  │  MySQL 8.0     │  │  │
│  │  │  (Angular) │  │ (Spring) │  │  (Database)    │  │  │
│  │  │   Nginx    │  │   Boot   │  │                │  │  │
│  │  │   :80      │←→│  :4000   │←→│    :3306       │  │  │
│  │  └────────────┘  └──────────┘  └────────────────┘  │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Managed by Terraform                                       │
│  - Security Groups                                          │
│  - Elastic IP                                              │
│  - Auto-restart policies                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
- **Angular 17+** with TypeScript
- **PrimeNG** UI Components
- **TailwindCSS** Styling
- **RxJS** Reactive Programming

### Backend
- **Spring Boot 3.x** with Java 17
- **Spring Security** + JWT Authentication
- **JPA/Hibernate** ORM
- **MySQL 8.0** Database

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD Automation
- **AWS EC2** - Cloud Hosting
- **Nginx** - Web Server & Reverse Proxy

---

## ✨ Key Features

### For Users
- 🎬 Browse movies and showtimes
- 💺 Interactive seat selection
- 🔒 Secure authentication
- 💳 Payment simulation
- 📱 Responsive design
- 📧 Booking confirmations

### For Admins
- 🎭 Movie management
- 🏢 Theater & screen configuration
- ⏰ Showtime scheduling
- 📊 Booking analytics
- ✅ Ticket verification

### Technical Features
- 🔐 JWT-based authentication
- 🎯 Role-based access control
- ⚡ Real-time seat availability
- 🔄 Optimistic locking for concurrency
- 🏥 Health checks & monitoring
- 🚀 Zero-downtime deployments

---

## 🛠️ Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)
- Java 17+ & Maven (for local backend dev)
- Git

### Local Development
```bash
# Clone repository
git clone https://github.com/n1shan1/ohnomovies.git
cd ohnomovies

# Setup environment
./setup.sh

# Or manually
cp .env.example .env
docker-compose up -d

# View logs
docker-compose logs -f

# Access application
# Frontend: http://localhost
# Backend:  http://localhost:4000/api/v1
```

### Run Tests
```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm test
```

---

## ☁️ AWS Deployment

### Prerequisites
- AWS Account
- AWS CLI configured
- Terraform installed
- SSH key pair created in AWS

### Deploy Infrastructure

1. **Configure Terraform variables:**
```bash
cd terraform
cat > terraform.tfvars << EOF
aws_region    = "us-east-1"
instance_type = "t3.medium"
key_name      = "your-ssh-key-name"
domain_name   = ""  # Optional
db_password   = "secure-password"
jwt_secret    = "secure-jwt-secret-minimum-32-chars"
EOF
```

2. **Apply Terraform:**
```bash
terraform init
terraform plan
terraform apply
```

3. **Note outputs:**
```bash
terraform output  # Save EC2 IP and SSH command
```

### Configure GitHub Actions

Add these secrets to your GitHub repository:

| Secret Name | Description |
|------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region (e.g., us-east-1) |
| `EC2_HOST` | EC2 public IP from Terraform |
| `EC2_SSH_PRIVATE_KEY` | Content of .pem file |
| `MYSQL_PASSWORD` | Database password |
| `JWT_SECRET` | JWT secret key |

### Automated Deployment

Push to main/master branch:
```bash
git push origin master
```

GitHub Actions will automatically:
1. ✅ Run tests
2. 🐳 Build Docker images
3. 📦 Push to GitHub Container Registry
4. 🚀 Deploy to EC2
5. 🔍 Run security scans

---

## 📖 API Documentation

### Authentication
```bash
# Register
POST /api/v1/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Login
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Public Endpoints
- `GET /api/v1/movies` - List all movies
- `GET /api/v1/movies/{id}` - Get movie details
- `GET /api/v1/movies/{id}/showtimes` - Get movie showtimes
- `GET /api/v1/theaters` - List all theaters
- `GET /api/v1/showtimes/{id}/seats` - Get seat availability

### Protected Endpoints (Requires JWT)
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/my-bookings` - Get user bookings
- `POST /api/v1/seats/lock` - Lock seat for booking

### Admin Endpoints (Requires ADMIN role)
- `POST /api/v1/admin/movies` - Create movie
- `POST /api/v1/admin/theaters` - Create theater
- `POST /api/v1/admin/showtimes` - Create showtime
- `POST /api/v1/admin/bookings/verify` - Verify booking

**Full API documentation:** See [README.md](README.md#api-documentation)

---

## 🔧 Configuration

### Environment Variables

```bash
# Database
MYSQL_ROOT_PASSWORD=secure_root_password
MYSQL_DATABASE=ohnomovies
MYSQL_USER=ohnomovies_user
MYSQL_PASSWORD=secure_user_password

# JWT
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters

# API
API_URL=http://localhost:4000/api/v1

# Ports
BACKEND_PORT=4000
FRONTEND_PORT=80

# Profile
SPRING_PROFILES_ACTIVE=prod
```

---

## 🧪 Testing

### Run All Tests
```bash
# Using Docker
docker-compose exec backend ./mvnw test
docker-compose exec frontend npm test

# Or via GitHub Actions
# Tests run automatically on every push
```

### Test Coverage
- Backend: JUnit 5 + Spring Boot Test
- Frontend: Jasmine + Karma
- Integration: TestContainers

---

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:4000/actuator/health

# Frontend health
curl http://localhost/health

# Database connectivity
docker-compose exec mysql mysqladmin ping
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## 🔐 Security

### Implemented Security Features
- ✅ JWT-based authentication
- ✅ Password encryption (BCrypt)
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ SQL injection prevention (JPA)
- ✅ XSS protection headers
- ✅ Security scanning in CI/CD
- ✅ Non-root containers
- ✅ Secret management

### Best Practices
- Never commit `.env` files
- Use strong passwords (16+ characters)
- Rotate JWT secrets regularly
- Enable HTTPS in production
- Keep dependencies updated
- Monitor security advisories

---

## 🚨 Troubleshooting

### Container Issues
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs [service]

# Restart service
docker-compose restart [service]

# Rebuild
docker-compose up -d --build
```

### Database Issues
```bash
# Access MySQL shell
docker-compose exec mysql mysql -u ohnomovies_user -p ohnomovies

# Check connections
docker-compose exec backend env | grep DB_
```

### Deployment Issues
```bash
# Check GitHub Actions logs
# Go to Actions tab in GitHub repository

# SSH into EC2
ssh -i your-key.pem ubuntu@<EC2_IP>

# Check deployment logs
cd /opt/ohnomovies/app
docker-compose ps
docker-compose logs
```

---

## 📈 Performance

### Optimizations Implemented
- ✅ Docker multi-stage builds
- ✅ Layer caching
- ✅ Database connection pooling
- ✅ JPA query optimization
- ✅ Angular lazy loading
- ✅ Nginx gzip compression
- ✅ Static asset caching
- ✅ Health check dependencies

### Scaling Considerations
- Use AWS RDS for managed database
- Add Application Load Balancer
- Implement Redis for caching
- Use CloudFront CDN
- Enable auto-scaling groups

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Authors

- **Nishant** - [n1shan1](https://github.com/n1shan1)

---

## 🙏 Acknowledgments

- Spring Boot & Spring Security teams
- Angular team
- Docker & Docker Compose
- Terraform by HashiCorp
- AWS
- PrimeNG UI library

---

## 📞 Support

- **Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md) and [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **Issues:** Open an issue on GitHub
- **Email:** [Add your email]

---

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] QR code generation
- [ ] Mobile app (React Native)
- [ ] Kubernetes deployment
- [ ] Microservices architecture
- [ ] Event-driven patterns with Kafka
- [ ] Advanced analytics dashboard
- [ ] Social login (OAuth2)
- [ ] Multi-language support

---

**⭐ If you find this project helpful, please consider giving it a star!**

**Made with ❤️ for DevOps learning and demonstration**
