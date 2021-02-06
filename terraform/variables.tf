variable "zone_domain" {
  description = "Rout53 zone domain name"
}

variable "frontend_record_name" {
  description = "Host zone font record name"
}

variable "app_name" {
  description = "App name"
  default     = "example"
}

variable "environment" {
  description = "Environment name"
}

variable "aws_region" {
  description = "AWS region name"
}
