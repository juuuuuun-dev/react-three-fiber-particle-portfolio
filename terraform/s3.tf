/*
https://github.com/terraform-aws-modules/terraform-aws-s3-bucket
*/

module "s3_bucket_for_logs" {
  source                         = "terraform-aws-modules/s3-bucket/aws"
  version                        = "~> 1.17"
  bucket                         = "${var.app_name}-${var.environment}-logs"
  acl                            = "log-delivery-write"
  block_public_policy            = true
  block_public_acls              = true
  force_destroy                  = true
  attach_elb_log_delivery_policy = true
  lifecycle_rule = [
    {
      id      = "log"
      enabled = true
      prefix  = "log/"
      tags = {
        rule      = "log"
        autoclean = "true"
      }
      expiration = {
        days = 60
      }
    },
  ]
}


module "s3_bucket_for_app_storage" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "~> 2.6"
  bucket        = "${var.app_name}-${var.environment}-storage"
  acl           = "public-read"
  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_static_website_policy.json
  website = {
    index_document = "index.html"
    error_document = "error.html"
  }
}

module "s3_bucket_for_redirect_app_storage" {
  source                  = "terraform-aws-modules/s3-bucket/aws"
  version                 = "~> 2.6"
  bucket                  = "redirect-${var.app_name}-${var.environment}-storage"
  acl                     = "private"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  website = {
    redirect_all_requests_to = "https://www.${var.zone_domain}"
  }
}


data "aws_iam_policy_document" "s3_static_website_policy" {
  statement {
    sid    = "PublicReadAndPutGetObject"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    resources = [
      "${module.s3_bucket_for_app_storage.s3_bucket_arn}/*",
    ]
  }
}
