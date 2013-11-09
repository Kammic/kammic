require 'spec_helper'
describe UserController do
  context 'show' do
    it 'gives 404 when not logged in' do
      get :show
      assert_response :missing
    end

    it 'gives back the user' do
      create_user(id: 1234)
      session[:user_id] = 1234
      get :show
      assert_response :success
    end

    it 'sets @user' do
      create_user(id: 1234)
      session[:user_id] = 1234

      get :show
      assert(assigns(:user))
    end
  end

  context 'logout' do
    it 'logs a user out when #logout' do
      session[:user_id] = 1234
      get :logout

      expect(session[:user_id]).to be_nil
    end

    it 'redirects the user to login path' do
      get :logout
      assert_response :redirect
    end
  end
end
