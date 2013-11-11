Kammic::Application.configure do
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false
  config.action_mailer.raise_delivery_errors = false
  config.active_support.deprecation = :log
  config.active_record.migration_error = :page_load
  config.assets.debug = true

  config.github_key    = ENV['GITHUB_KEY']    || '65279e1360471fcf2d73'
  config.github_secret = ENV['GITHUB_SECRET'] || '80465cc4657703dd81fc8cb10b4a34e0d5c424f7'

  config.s3_access_key = 'AKIAICK4VG37DHFYCW3A'
  config.s3_secret     = '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'
  config.s3_bucket     = 'kammic'
end
