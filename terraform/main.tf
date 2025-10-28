data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group
resource "aws_security_group" "ohnomovies_sg" {
  name        = "ohnomovies-security-group"
  description = "Security group for OhnoMovies application"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access."
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "ohnomovies-sg"
    Project     = "OhnoMovies"
    Environment = "Production"
  }
}

# EC2 Instance
resource "aws_instance" "ohnomovies_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.ohnomovies_sg.id]

  root_block_device {
    volume_size = 30
    volume_type = "gp2" # Free tier: 30 GB of EBS gp2 storage
  }

  user_data = file("${path.module}/user-data.sh")

  tags = {
    Name        = "ohnomovies-server"
    Project     = "OhnoMovies"
    Environment = "Production"
  }
}

# Elastic IP
resource "aws_eip" "ohnomovies_eip" {
  instance = aws_instance.ohnomovies_server.id
  domain   = "vpc"

  tags = {
    Name        = "ohnomovies-eip"
    Project     = "OhnoMovies"
    Environment = "Production"
  }
}
