require 'spec_helper'

describe ReposController do
  context 'login' do
    it 'errors when not logged in' do
      get :show
      assert_response :forbidden
   end

    it 'works when logged in' do
      session[:user_id] = 1234
      create_user(id: 1234)

      get :show
      assert_response :success
    end
  end

  context '#show' do
    before :each do
      session[:user_id] = 1234
      create_user(id: 1234)
    end

    it 'gets the list of repos' do
      get :show
      assert_not_nil assigns(:repos)
    end

    it 'sets loading_repos according to the db' do
      get :show
      assert_not_nil assigns(:loading_repos)
    end
  end
end
