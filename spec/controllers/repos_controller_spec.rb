require 'spec_helper'
describe ReposController do
  context 'login' do
    it 'errors when not logged in' do
      get :index
      assert_response :forbidden
   end

    it 'works when logged in' do
      session[:user_id] = 1234
      create_user(id: 1234)

      get :index
      assert_response :success
    end
  end

  context '#index' do
    before :each do
      session[:user_id] = 1234
      create_user(id: 1234)
    end

    it 'gets the list of repos' do
      get :index
      assert_not_nil assigns(:repos)
    end

    it 'returns json format' do
      get :index
      expect(response.content_type).to eq('application/json')
    end

    context 'loading repos status' do

      it 'sets are_repos_loading to false when not loading' do
        get :index
        expect(assigns(:are_repos_loading)).to eq(false)
      end

      it 'sets are_repos_loading to true when loading' do
        User.find(1234).tap do |user|
          user[:loading_repos] = true
          user.save
        end

        get :index
        expect(assigns(:are_repos_loading)).to eq(true)
      end

    end
  end

  context '#refresh' do
    before :each do
      session[:user_id] = 1234
      create_user(id: 1234)
    end

    it 'redirects you back to repos_path' do
      expect(get :refresh).to redirect_to repos_path
    end

    it 'calls User#queue_update_repos_from_github' do
      user_double = double().as_null_object
      controller.stub(:current_user).and_return(user_double)
      user_double.should_receive(:queue_update_repos_from_github).once

      get :refresh
    end

    it 'sets User#loading_repos to true' do
      get :refresh
      expect(User.find(1234)[:loading_repos]).to eq(true)
    end
  end

  context '#follow' do
    before :each do
      session[:user_id] = 1234
      create_user(id: 1234)
      create_repo("user" => User.find(1234))
    end

    it 'adds a book model from a repo' do
      get :follow, {id: 42}
      expect(Book.where(repo_id: 42, user_id: 1234).count).to eq(1)
      assert_response :success
    end

    it 'returns 404 on non-existing repos' do
      get :follow, {id: 40}
      assert_response :missing
    end

    it 'gives 403 for repos not owned by the user' do
      repo = Repo.find(42)
      repo.user_id = 999
      repo.save

      get :follow, {id: 42}
      assert_response :forbidden
    end

    it 'works if a book is already added' do
      get :follow, {id: 42}
      get :follow, {id: 42}
      expect(Book.where(repo_id: 42, user_id: 1234).count).to eq(1)
      assert_response :success
    end
  end
end
