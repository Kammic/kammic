require 'spec_helper'

describe Github::RepoFinder do
  before do
    stub_const("Octokit::Client", double("Octokit::Client").as_null_object)
  end
  
  it 'returns an empty array if auth_token is invalid' do
    Octokit::Client.stub(:repos).and_raise(Octokit::Unauthorized)
    expect(Github::RepoFinder.find_repos('xyz')).to eq([])
  end

  context '#clean_hash' do
    it 'returns only allowed attributes in Repo' do
      dirty_hash = {id: 1235, private: true, pushed_at: 12345, other: 1, html_url: 'xyz'}
      clean_hash = Github::RepoFinder.clean_hash(dirty_hash)
      expect(clean_hash[:id]).to eq(1235)
      expect(clean_hash[:private]).to eq(true)
      expect(clean_hash[:other]).to eq(nil)
      expect(clean_hash[:html_url]).to eq('xyz')
    end
  end
end
