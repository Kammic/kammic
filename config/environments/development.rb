Kammic::Application.configure do
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false
  config.action_mailer.raise_delivery_errors = false
  config.active_support.deprecation = :log
  config.active_record.migration_error = :page_load
  config.assets.debug = true

  config.github_key    = ENV['GITHUB_KEY']    || '2e0806ae149248209186'
  config.github_secret = ENV['GITHUB_SECRET'] || '84db43fbe23682d7eccb499ea57aebd015fc339e'

  config.s3_access_key = 'AKIAICK4VG37DHFYCW3A'
  config.s3_secret     = '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'
  config.s3_bucket     = 'kammic-dev'
end
