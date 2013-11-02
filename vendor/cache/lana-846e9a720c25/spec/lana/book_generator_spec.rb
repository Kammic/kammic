require 'spec_helper'

describe Lana::BookGenerator do
  let(:subject) { Lana::BookGenerator }
  context '#initialize' do
    it 'takes a git repo as an argument' do
      compiler = subject.new(remote: 'git@github.com:Kammic/lana.git',
                             local: '/tmp',
                             branch: 'dev',
                             manifest_file: 'file',
                             output: 'output.pdf')
      expect(compiler.remote).to eq('git@github.com:Kammic/lana.git')
      expect(compiler.local).to eq('/tmp')
      expect(compiler.branch).to eq('dev')
      expect(compiler.manifest_file).to eq('file')
      expect(compiler.output).to eq('output.pdf')

      compiler = subject.new(remote: 'git@github.com:Kammic/lana.git',
                             local: '/tmp')
      expect(compiler.branch).to eq('master')
      expect(compiler.manifest_file).to eq('manifest.json')
      expect(compiler.output).to eq('/tmp/output.pdf')
    end
  end

  context '#generate' do
    let(:tmp_repo_path){ File.expand_path('../../tmp/clone', __FILE__) }
    let(:tmp_book_path){ File.expand_path('../../tmp/book.pdf', __FILE__) }
    let(:fixture_repo) { File.expand_path('../../fixtures/example_book', __FILE__) }

    it 'calls clone on grit' do
      double = double().as_null_object
      compiler = subject.new(remote: 'git@github.com:Kammic/lana.git',
                             local: '/tmp')
      compiler.stub(:grit_repo).and_return(double)
      double.should_receive(:clone).with({branch: 'master'}, 
                                         'git@github.com:Kammic/lana.git',
                                         '/tmp')
      compiler.stub(:compiler).and_return(double)
      compiler.generate
    end

    xit 'clones the repo' do
      FileUtils.rm_rf tmp_repo_path
      compiler = subject.new(remote: 'git@github.com:Kammic/lana.git',
                             local: tmp_repo_path)
      compiler.generate
      expect(File.exists?(tmp_repo_path)).to eq(true)
    end

    it 'Generates a pdf from the manifest' do
      FileUtils.rm tmp_book_path if File.exists? tmp_book_path
      double = double().as_null_object
      double.stub(:clone)
      compiler = subject.new(remote: 'git@github.com:Kammic/lana.git',
                             local: fixture_repo,
                             manifest_file: 'simple.json',
                             output: tmp_book_path)
      compiler.stub(:grit_repo).and_return(double)
      compiler.generate
      expect(File.exists?(tmp_book_path)).to eq(true)
    end

  end
end
