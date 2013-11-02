APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..', '..'))
$: << File.join(APP_ROOT, 'lib/lana')

require 'rubygems'
require 'bundler/setup'
require 'lana'

RSpec.configure do |config|
  # some (optional) config here
end


def fixture_path(base = "manifest.json")
  "spec/fixtures/example_book/#{base}"
end

def manifest
  Lana::Manifest.new(fixture_path)
end
