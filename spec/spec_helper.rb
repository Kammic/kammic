# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true
  config.infer_base_class_for_anonymous_controllers = false
  config.order = "random"
end


def create_user(options = {})
  options = {
    uid: 1,
    id:  1,
    provider: 'github',
    name: 'test user',
    auth_token: 'token',
  }.merge(options)
  create(User, options)
end

def create_repo(options = {})
  options = {
    "id" => 42,
    "name" => "repo_name",
    "full_name" => "user/repo_one",
    "description" => "xyz",
    "private" => false,
    "clone_url" => "http://github.com/clone_me",
    "master_branch" => "master",
    "pushed_at" => Time.now,
    }.merge(options)
  create(Repo, options)
end

def create_build(options = {})
  options = {}.merge(options)
  create(Build, options)
end

def create_book(options = {})
  options = {
    id: 55,
    user_id: 1234,
    repo_id: 42,
  }.merge(options)

  create(Book, options)
end

def create(model, options)
  model.create(options)
end
