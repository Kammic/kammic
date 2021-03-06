require 'spec_helper'

describe Github::RepoQueue do
  let(:subject) { Github::RepoQueue }

  before do
    create_user(uid: 'user', auth_token: 'some_token', id: 42)
  end

  context '#queue_update' do
    it 'calls enqueue on QC' do
      stub_const("QC", double("QC"))
      QC.should_receive(:enqueue).with("Github::RepoQueue.update_from_github", 42)

      subject.queue_update 42
    end
  end

  context 'user#loading_repos' do
    it 'sets the loading_repos param to false once done' do
      User.find(42).tap {|user| user[:loading_repos] = true}

      Github::RepoFinder.stub(:find_repos).and_return([])
      subject.update_from_github(42)

      User.find(42).tap do |user|
        expect(user[:loading_repos]).to eq(false)
      end
    end
  end

  context '#create_or_update_from_hash' do
    it 'creates a repo from a given hash and user_id' do
      hash = {
          "id" => 55,
          "name" => "repo_name",
          "full_name" => "user/repo_one",
          "description" => "xyz",
          "private" => false,
          "clone_url" => "http://github.com/clone_me",
          "html_url" => "http://github.com/clone_me",
          "master_branch" => "master",
          "pushed_at" => Time.now,
      }

      subject.send(:create_or_update_from_hash, hash, 42)
      repo = Repo.find_by_github_id(55)
      expect(repo[:name]).to eq('repo_name')
      expect(repo[:user_id]).to eq(42)
      expect(repo[:html_url]).to eq("http://github.com/clone_me")
    end

    it 'updates a repo if github_id already exists' do
      create_repo(github_id: 99, name: 'old_name', user_id: 42)

      hash = {
        "id" => 1,
        "name" => "new_name",
        "full_name" => "user/repo_one",
        "description" => "xyz",
        "private" => false,
        "clone_url" => "http://github.com/clone_me",
        "html_url" => "http://github.com/clone_me",
        "master_branch" => "master",
        "pushed_at" => Time.now,
      }

      subject.send(:create_or_update_from_hash, hash, 42)
      repos = Repo.where(github_id: 1)

      expect(repos.count).to eq(1)
      expect(repos.first[:name]).to eq('new_name')
    end
  end

  context '#delete_user_repos' do
    it 'it deletes a repo if it exists in the DB' do
      create_repo("user_id" => 42, "github_id" => 123)
      expect {
        subject.send(:delete_user_repos, 42)
      }.to change{Repo.count}.from(1).to(0)
    end
  end

  context '#update_from_github' do  
    before do
      stub_const "Github::RepoFinder", double("Github::RepoFinder")
    end

    it 'returns false if no user is found' do
      expect(subject.update_from_github(5555)).to eq(false)
    end

    it 'should call Github::RepoFinder with the correct auth_token' do
      Github::RepoFinder
        .should_receive(:find_repos)
        .with('some_token')
        .and_return([])
      subject.update_from_github(42)
    end

    it 'creates repos from Github::RepoFinder' do
      create_repo(github_id: 1, name: 'old_name', user_id: 42)

      expected_hash = [
      {
          "id" => 1,
          "name" => "repo_one",
          "full_name" => "user/repo_one",
          "description" => "xyz",
          "private" => false,
          "clone_url" => "http://github.com/clone_me",
          "master_branch" => "master",
          "pushed_at" => Time.now,
      },
      {
          "id" => 2,
          "name" => "repo_two",
          "full_name" => "user/repo_two",
          "description" => "xyz2",
          "private" => false,
          "clone_url" => "http://github.com/clone_me",
          "master_branch" => "dev",
          "pushed_at" => Time.now,
      }]

      Github::RepoFinder.stub(:find_repos).and_return(expected_hash)
      subject.update_from_github(42)

      expect(User.find(42).repos.count).to eq(2)
      expect(Repo.where(user_id: 42).count).to eq(2)

      repo_one = Repo.where(user_id: 42, name: 'repo_one').first
      expect(repo_one[:full_name]).to eq('user/repo_one')
      expect(repo_one[:private]).to eq(false)
      expect(repo_one[:github_id]).to eq(1)
    end

    it 'updates existing repos with the same github_id' do
      Repo.create({
        "name" => "repo_old",
        "github_id" => 1,
        "full_name" => "user/repo_one",
        "description" => "xyz",
        "private" => false,
        "clone_url" => "http://github.com/clone_me",
        "master_branch" => "master",
        "pushed_at" => Time.now,
        "user_id" => 42
      })

      expected_hash = [
      {
        "id" => 1,
        "name" => "repo_new",
        "full_name" => "user/repo_one",
        "description" => "xyz",
        "private" => false,
        "clone_url" => "http://github.com/clone_me",
        "master_branch" => "master",
        "pushed_at" => Time.now,
      },
      {
        "id" => 2,
        "name" => "repo_two",
        "full_name" => "user/repo_two",
        "description" => "xyz2",
        "private" => false,
        "clone_url" => "http://github.com/clone_me",
        "master_branch" => "dev",
        "pushed_at" => Time.now,
      }]

      Github::RepoFinder.stub(:find_repos).and_return(expected_hash)
      subject.update_from_github(42)
      expect(Repo.count).to eq(2)
      expect(Repo.find_by_github_id(1).name).to eq('repo_new')
    end
  end
end
