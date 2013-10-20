require 'spec_helper'

describe Github::Manifest do
  let(:subject) { Github::Manifest }

  def read_fixture(path = 'manifest.yml')
    File.read("spec/fixtures/yaml/#{path}")
  end

  context '#enqueue_update' do
    it 'calls enqueue with the correct args' do
      QC.should_receive(:enqueue).with("Github::Manifest.update_from_github", 21)
      subject.enqueue_update 21
    end
  end

  context '#clean_hash' do
    it 'returns only allowed attributes in Repo' do
      dirty_hash = {id:1235, title: 'xyz', something_else: false}
      clean_hash = subject.clean_hash(dirty_hash)
      expect(clean_hash[:id]).to eq(1235)
      expect(clean_hash[:title]).to eq('xyz')
      expect(clean_hash[:something_else]).to be_nil
    end
  end

  context '#update_from_github' do
    before do
      create_user(id: 1234)
      create_repo(id: 42, user_id: 1234)
      Book.create!(id: 1234, repo_id: 42, user_id: 1234)
    end

    it 'sets book[:loading_manifest] to false when refreshed' do
      book = Book.find_by_id(1234)
      book[:loading_manifest] = true
      book.save

      contents = OpenStruct.new(content: Base64.encode64(read_fixture))
      Octokit.stub(:contents).and_return contents

      subject.update_from_github(1234)
      book.reload
      expect(book[:loading_manifest]).to eq(false)
    end

    it 'returns false if the book doesn\'t exist' do
      expect(subject.update_from_github(12345)).to eq(false)
    end

    it 'updates the info of a manifest record from github' do
      contents = OpenStruct.new(content: Base64.encode64(read_fixture))
      Octokit.stub(:contents).and_return contents

      subject.update_from_github(1234)
      expect(::Manifest.count).to eq(1)
      expect(::Manifest.first["title"]).to eq("Some Title")
    end

    it 'deletes old Manifests for the book' do
      Manifest.create!(book_id: 1234, id: 99)
      expect(::Manifest.count).to eq(1)

      contents = OpenStruct.new(content: Base64.encode64(read_fixture))
      Octokit.stub(:contents).and_return contents

      subject.update_from_github(1234)
      expect(::Manifest.count).to eq(1)
      expect(::Manifest.first["title"]).to eq("Some Title")
    end
  end

  context '#hash_from_content' do
    it 'creates a hash from passed in content' do
      results = subject.hash_from_content(read_fixture)
      expect(results["title"]).to eq("Some Title")
    end
  end

  context '#retrieve_manifest' do
    it 'it decodes the base64 to normal content' do
      contents = OpenStruct.new(content: Base64.encode64('test'))
      Octokit.stub(:contents).and_return contents

      content = subject.retrieve_manifest("ortuna/progit-bana", 'manifest.yml')
      expect(content).to eq('test')
    end
  end
end
