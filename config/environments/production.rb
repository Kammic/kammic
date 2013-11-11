Kammic::Application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.serve_static_assets = true
  config.assets.js_compressor = :uglifier
  config.assets.compile = true
  config.assets.digest = true
  config.assets.version = '1.0'
  config.log_level = :info
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.log_formatter = ::Logger::Formatter.new



  config.github_key    = ENV['GITHUB_KEY']
  config.github_secret = ENV['GITHUB_SECRET']
  config.s3_access_key = ENV['S3_KEY']
  config.s3_secret     = ENV['S3_SECRET']
  config.s3_bucket     = ENV['S3_BUCKET']
end
