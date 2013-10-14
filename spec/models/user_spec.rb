require 'spec_helper'

describe User do
  context '#create_with_omniauth' do
    it 'creates a user with a given auth hash' do
      auth = {
        provider: 'github',
        uid:      'ortuna',
        info: {
          image: 'image url',
          name:  'test user',
        },
        credentials: {
          token: 'xyz'
        }
      }.with_indifferent_access
      expect(User.create_with_omniauth(auth)).to_not be_nil
      user = User.where(uid: 'ortuna').first

      expect(user[:provider]).to eq('github')
      expect(user[:name]).to eq('test user')
      expect(user[:auth_token]).to eq('xyz')
      expect(user[:image_url]).to eq('image url')
    end
  end

  context '#find_with_omniauth' do
    it 'finds the user with uid' do
      create_user(id: 123, uid: 'omniauth_user')
      user = User.find_with_omniauth(uid: 'omniauth_user')
      expect(user[:id]).to eq(123)
    end
  end

  context '#update_repos_from_github' do
    before do
      original_verbose, $VERBOSE = $VERBOSE, nil
      Github::RepoFinder = double()
      $VERBOSE = original_verbose
      create_user(uid: 'user', auth_token: 'some_token', id: 42)
    end

    after do
      original_verbose, $VERBOSE = $VERBOSE, nil
      Github::RepoFinder = @repo_const
      $VERBOSE = original_verbose
    end

    it 'should call Github::RepoFinder with the correct auth_token' do
      Github::RepoFinder
        .should_receive(:find_repos)
        .with('some_token')
        .and_return([])
      User.where(uid: 'user').first.update_repos_from_github
    end

    it 'creates repos from Github::RepoFinder' do
      expected_hash = [
      {
          "name" => "repo_one",
          "full_name" => "user/repo_one",
          "description" => "xyz",
          "private" => false,
          "clone_url" => "http://github.com/clone_me",
          "master_branch" => "master",
          "pushed_at" => Time.now,
      },
      {
          "name" => "repo_two",
          "full_name" => "user/repo_two",
          "description" => "xyz2",
          "private" => false,
          "clone_url" => "http://github.com/clone_me",
          "master_branch" => "dev",
          "pushed_at" => Time.now,
      }]
      Github::RepoFinder.stub(:find_repos).and_return(expected_hash)
      User.where(uid: 'user').first.update_repos_from_github

      expect(User.where(id: 42).first.repos.count).to eq(2)
      expect(Repo.where(user_id: 42).count).to eq(2)

      repo_one = Repo.where(user_id: 42, name: 'repo_one').first
      expect(repo_one[:full_name]).to eq('user/repo_one')
      expect(repo_one[:private]).to eq(false)
    end
  end
end
