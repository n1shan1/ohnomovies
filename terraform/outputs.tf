output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.ohnomovies_server.id
}

output "public_ip" {
  description = "Elastic IP address of the server"
  value       = aws_eip.ohnomovies_eip.public_ip
}

output "public_dns" {
  description = "Public DNS name of the server"
  value       = aws_instance.ohnomovies_server.public_dns
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.ohnomovies_sg.id
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_eip.ohnomovies_eip.public_ip}"
}

output "application_url" {
  description = "Application URL"
  value       = "http://${aws_eip.ohnomovies_eip.public_ip}"
}
