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

resource "aws_route53_record" "redirect_record" {
  zone_id = data.aws_route53_zone.app_zone.zone_id
  name    = ""
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
    evaluate_target_health = true
  }
}
resource "aws_route53_record" "search_console_dns" {
  zone_id = data.aws_route53_zone.app_zone.zone_id
  name    = var.zone_domain
  type    = "TXT"
  ttl     = 1800
  records = [var.search_console_dns_record]
}

