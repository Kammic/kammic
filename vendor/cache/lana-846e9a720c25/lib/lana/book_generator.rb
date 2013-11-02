require 'grit'

module Lana
  class BookGenerator
    attr_reader :local, :remote, :branch, :manifest_file, :output

    def initialize(options = {})
      @options       = default_options.merge(options)
      @local         = @options[:local]
      @remote        = @options[:remote]
      @branch        = @options[:branch]
      @manifest_file = @options[:manifest_file]
      @output        = @options[:output]
    end

    def generate
      grit_repo.clone({branch: branch}, remote, local)
      compiler.compile(output)
    end

    private
    def compiler
      Compiler.new(manifest_file, local)
    end

    def grit_repo
      Grit::Git.new(local)
    end

    def default_options
      {
        branch: 'master',
        local:  '/tmp/tmp_clone',
        manifest_file: 'manifest.json',
        output: '/tmp/output.pdf'
      }
    end
  end
end
