/*
terraform init -backend-config=terraform.tfbackend
*/

terraform {
  required_version = ">=0.13"
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}
provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}
