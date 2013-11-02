module Lana
  class Compiler
    attr_reader :base_path

    def initialize(manifest_path, base_path = '')
      @base_path  = add_slash(base_path)
      @manifest   = Manifest.new("#{@base_path}#{manifest_path}")
    end

    def compile(output_path)
      pages = @manifest.pages.map { |page| full_path(page) }
      system("pandoc -o #{output_path} #{pages.join(' ')}")
    end

    private
    def add_slash(path)
      return path if path == ''
      return path if path.end_with?('/')
      "#{path}/"
    end

    def full_path(file)
      "#{@base_path}#{file}"
    end
  end
end
