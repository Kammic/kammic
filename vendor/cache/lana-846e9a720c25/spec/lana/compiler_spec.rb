require 'spec_helper'

describe Lana::Compiler do
  let(:subject) { Lana::Compiler }

  before do
    @compiler = subject.new(fixture_path)
  end
  context 'book' do
    it 'can compile a book' do
      output_path = File.expand_path('../../tmp/output.pdf', __FILE__)
      compiler    = subject.new('simple.json', fixture_path(''))
      compiler.compile(output_path)
      expect(File.exists?(output_path)).to eq(true)
      FileUtils.rm(output_path)
    end
  end

  context '#initialize' do
    it 'can take manifest as an argument' do
      subject.new(fixture_path)
    end

    it 'takes a base path' do
      subject.new('simple.json', fixture_path(''))
    end
  end

  context '#full_path' do
    it 'creates a path relative to base_path' do
      compiler = subject.new('simple.json', fixture_path(''))
      expect(compiler.send(:full_path,'main.md')).to eq(fixture_path('main.md'))
    end
  end

  context '#compile' do
    it 'sends the pages list to pandoc' do
      pages = Lana::Manifest.new(fixture_path).pages
      @compiler.should_receive(:system).with("pandoc -o output.pdf #{pages.join(' ')}")
      @compiler.compile("output.pdf")
    end

    it 'sends the pages list with a base_path to pandoc' do
      manifest = Lana::Manifest.new(fixture_path('simple.json'))
      pages    = manifest.pages.map { |page| "#{fixture_path(page)}" }
      compiler = subject.new('simple.json', fixture_path(''))

      compiler.should_receive(:system).with("pandoc -o output.pdf #{pages.join(' ')}")
      compiler.compile("output.pdf")
    end
  end
end
