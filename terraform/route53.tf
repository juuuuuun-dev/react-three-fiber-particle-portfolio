data "aws_route53_zone" "app_zone" {
  name = var.zone_domain
}

resource "aws_route53_record" "frontend_record" {
  zone_id = data.aws_route53_zone.app_zone.zone_id
  name    = var.frontend_record_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.default.domain_name
    zone_id                = aws_cloudfront_distribution.default.hosted_zone_id
    evaluate_target_health = true
  }
}