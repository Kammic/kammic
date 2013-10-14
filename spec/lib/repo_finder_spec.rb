require 'spec_helper'

describe Github::RepoFinder do
  before do
    stub_const("Octokit::Client", double("Octokit::Client").as_null_object)
  end
  
  it 'returns an empty array if auth_token is invalid' do
    Octokit::Client.stub(:repos).and_raise(Octokit::Unauthorized)
    expect(Github::RepoFinder.find_repos('xyz')).to eq([])
  end
end
