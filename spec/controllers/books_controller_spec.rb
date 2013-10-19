require 'spec_helper'

describe BooksController do
  describe 'filters' do
    it 'should forbid without login' do
      get :index 
      assert_response :forbidden
    end

    it 'Allows you when logged in' do
      session[:user_id] = 1234
      create_user(id: 1234)

      get :index
      assert_response :success
    end
  end

  describe '#index' do
    before do
      session[:user_id] = 1234
      create_user(id: 1234)
    end

    it 'sets @books correctly' do
      get :index
      expect(assigns(:books)).to eq([])
    end

    it '@books should not return undefined repos' do
      5.times { |x| Book.create!(user_id: 5, repo_id: x+1) }

      get :index
      expect(assigns(:books)).to eq([])
    end

    it '@books returns defined repos' do
      Repo.create({
        "id" => 42,
        "name" => "repo_name",
        "full_name" => "user/repo_one",
        "description" => "xyz",
        "private" => false,
        "clone_url" => "http://github.com/clone_me",
        "master_branch" => "master",
        "pushed_at" => Time.now,
        "user" => User.find(1234)
      })
      Book.create!(user_id: 1234, repo_id: 42)
      Book.create!(user_id: 1234, repo_id: 41)
      Book.create!(user_id: 1234, repo_id: 40)

      get :index
      expect(assigns(:books).count).to eq(1)
    end
  end
end
