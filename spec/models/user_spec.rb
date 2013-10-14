require 'spec_helper'

describe User do
  context '#create_with_omniauth' do
    it 'creates a user with a given auth hash' do
      auth = {
        provider: 'github',
        uid:      '12345',
        info: {
          image:     'image url',
          name:      'test user',
          nickname:  'nick_name',
        },
        credentials: {
          token: 'xyz'
        }
      }.with_indifferent_access
      expect(User.create_with_omniauth(auth)).to_not be_nil
      user = User.where(uid: '12345').first

      expect(user[:provider]).to eq('github')
      expect(user[:uid]).to eq('12345')
      expect(user[:login]).to eq('nick_name')
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

  context ".queue_update_repos_from_github" do
    it "calls #queue_update_repos_from_github on given user_id" do
      user = double()
      user.should_receive(:update_repos_from_github)
      User.stub(:where).and_return([user])
      User.queue_update_repos_from_github(42)
    end
  end

  context '#queue_update_repos_from_github' do
    before do 
      stub_const "QC", double("QC")
      create_user(uid: 'user', auth_token: 'some_token', id: 42)
    end

    it 'sends the user repo update to the queue' do
      QC.should_receive(:enqueue)
        .with("User.queue_update_repos_from_github", 42)
      User.where(id: 42).first.queue_update_repos_from_github
    end
  end

  context '#update_repos_from_github' do
    before do
      stub_const "Github::RepoFinder", double("Github::RepoFinder")
      create_user(uid: 'user', auth_token: 'some_token', id: 42)
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
