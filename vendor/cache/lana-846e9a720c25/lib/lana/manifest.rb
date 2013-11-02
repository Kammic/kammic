require 'json'

module Lana
  class FileNotFound < Exception; end
  class InvalidManifest < Exception; end

  class Manifest
    attr_reader :path

    def initialize(path)
      raise FileNotFound.new(path) unless File.exists? path
      @path   = path
      @config = parse_json
    end

    def [](key)
      @config[key]
    end

    def pages
      recursive_page_list(self["pages"]).flatten
    end

    private
    def recursive_page_list(manifest_pages)
      [].tap do |pages|
        manifest_pages.each do |_, value|
          if value.respond_to? :each
            pages << recursive_page_list(value)
          else
            pages << value
          end
        end
      end
    end

    def read_file
      File.read(@path)
    end

    def parse_json
      JSON.parse(read_file)
    rescue JSON::ParserError => e
      raise InvalidManifest
    end
  end
end
