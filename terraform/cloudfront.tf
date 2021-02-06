locals {
  s3_origin_id = "${var.frontend_record_name}.${var.zone_domain}"
}

resource "aws_cloudfront_distribution" "default" {
  origin {
    domain_name = module.s3_bucket_for_app_storage.this_s3_bucket_bucket_domain_name
    origin_id   = local.s3_origin_id
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }
  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "index.html"
  comment             = "${var.app_name}-${var.environment}"
  logging_config {
    # bucket = data.aws_s3_bucket.logs.bucket_domain_name
    bucket = module.s3_bucket_for_logs.this_s3_bucket_bucket_domain_name
    prefix = "cloudfront"
  }
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    # min_ttl                = 0
    # default_ttl            = 3600
    # max_ttl                = 86400
    compress = true
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  custom_error_response {
    error_caching_min_ttl = 3000
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  aliases = [local.s3_origin_id]

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.virginia_cert.arn
    ssl_support_method  = "sni-only"
  }
  tags = {
    "Name" = "${var.app_name}-${var.environment}"
  }
}

