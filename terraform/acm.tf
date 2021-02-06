
provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

resource "aws_acm_certificate" "virginia_cert" {
  domain_name       = "${var.frontend_record_name}.${var.zone_domain}"
  validation_method = "DNS"
  # Most be virginia region
  provider = aws.virginia
  lifecycle {
    create_before_destroy = true
  }
  tags = {
    "Name" : "Virginia cert"
  }
}

resource "aws_route53_record" "virginia_dns_validation_certificate" {
  for_each = {
    for dvo in aws_acm_certificate.virginia_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  zone_id         = data.aws_route53_zone.app_zone.zone_id
  ttl             = 60
}

resource "aws_acm_certificate_validation" "virginia_validation" {
  # Most be virginia region
  provider                = aws.virginia
  certificate_arn         = aws_acm_certificate.virginia_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.virginia_dns_validation_certificate : record.fqdn]
}
