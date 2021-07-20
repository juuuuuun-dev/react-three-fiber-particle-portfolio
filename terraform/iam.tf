module "iam_s3_storage_access_user" {
  source                        = "terraform-aws-modules/iam/aws//modules/iam-user"
  version                       = "~> 3.0"
  name                          = "${var.app_name}-s3-storage-access-user"
  create_iam_user_login_profile = false
  create_iam_access_key         = true
}


module "iam_s3_access_group_policy" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-group-with-policies"
  version = "~> 3.0"
  name    = "${var.app_name}-s3-storage-access-group"
  group_users = [
    module.iam_s3_storage_access_user.this_iam_user_name,
  ]
  custom_group_policies = [
    {
      name   = "AllowS3Listing"
      policy = data.aws_iam_policy_document.s3_storage_access_policy.json
    },
  ]
}

data "aws_iam_policy_document" "s3_storage_access_policy" {
  statement {
    sid    = "PublicReadAndPutGetObject"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]
    resources = [
      "${module.s3_bucket_for_app_storage.s3_bucket_arn}/*",
    ]
  }
}




# module "s3_iam_group" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-group-with-assumable-roles-policy"
#   version = "~> 3.0"
#   name    = "${var.app_name}-s3-storage-access-group"
#   # assumable_roles = [
#   #   "s3.amazonaws.com",
#   # ]
#   group_users = [
#     module.iam_s3_storage_access_user.this_iam_user_name,
#   ]
# }
