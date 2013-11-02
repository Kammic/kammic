require 'spec_helper'

describe Lana::Manifest do
  let(:subject) { Lana::Manifest }

  before do 
    @manifest = manifest
  end

  context '#initialize' do
    it 'throws an error with an unkown file' do
      expect {
        Lana::Manifest.new('/some/unkown/path')  
      }.to raise_error(Lana::FileNotFound)
    end

    it 'knows its own path' do
      manifest = Lana::Manifest.new(fixture_path)
      expect(manifest.path).to eq(fixture_path)
    end
  end

  context '#read_file' do
    it 'can read a JSON file' do
      content = @manifest.send(:read_file)
      expect(content).to_not be_nil
    end
  end

  context '#parse_json' do
    it 'raises InvalidManifest when there is invalid json' do
      expect {
        manifest = Lana::Manifest.new('spec/fixtures/example_book/invalid.json')
        manifest.send(:parse_json)
      }.to raise_error(Lana::InvalidManifest)
    end

    it 'can parse the string into JSON' do
      json  = @manifest.send(:parse_json)
      expect(json["pages"]).to_not be_nil
    end
  end

  context '#[]' do
    it 'can read from the JSON hash' do
      expect(@manifest["title"]).to eq("Some Title")
      expect(@manifest["cover_image"]).to eq("assets/cover.jpg")
      expect(@manifest["pages"]).to_not be_nil
    end
  end

  context '#pages' do
    it 'can get a flat array of files/pages' do
      pages = @manifest.pages
      expected_pages = 
        ["01-introduction/01-chapter1.markdown",
         "02-introduction/01-chapter1.markdown",
         "03-introduction/01-chapter99.markdown",
         "04-introduction/01-chapter42.markdown",
         "05-git-basics/01-chapter2.markdown",
         "06-git-branching/01-chapter3.markdown",
         "07-git-server/01-chapter4.markdown",
         "08-git-tools/01-chapter6.markdown",
         "09-customizing-git/01-chapter7.markdown",
         "10-git-and-other-scms/01-chapter8.markdown",
         "11-git-internals/01-chapter9.markdown"]
      expect(pages.count).to eq(11)
      expected_pages.each do |page|
        expect(pages.include?(page)).to eq(true)
      end
    end
  end

end
