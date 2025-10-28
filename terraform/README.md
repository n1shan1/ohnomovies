# Terraform Configuration for OhnoMovies

Simple Terraform setup to deploy OhnoMovies to AWS EC2.

## Prerequisites

- AWS CLI configured (`aws configure`)
- Terraform installed
- AWS EC2 Key Pair created

## Quick Start

1. **Copy the example config:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars`:**
   ```hcl
   aws_region    = "us-east-1"
   instance_type = "t2.micro"
   key_name      = "your-key-name"  # Your AWS key pair name
   ```

3. **Deploy:**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

4. **Get outputs:**
   ```bash
   terraform output
   ```

## What Gets Created

- **EC2 Instance**: t2.micro Ubuntu 22.04 (Free Tier eligible)
- **Security Group**: Ports 22, 80, 443 open
- **Elastic IP**: Static IP for your instance
- **User Data**: Installs Docker & Docker Compose automatically

## After Deployment

SSH into your instance:
```bash
ssh -i your-key.pem ubuntu@<public_ip>
```

The instance will have:
- Docker installed
- Docker Compose installed
- `/opt/ohnomovies/app/` directory ready for deployment
- `/opt/ohnomovies/deploy.sh` script for CI/CD

## Cleanup

```bash
terraform destroy
```

## Notes

- Default credentials are hardcoded in `docker-compose.yml`
- No environment variables needed for deployment
- Free Tier eligible with `t2.micro` instance
