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

    context 'loading repos status' do

      it 'refresh_button_caption should be \'Refresh Repos\' when not loading' do
        get :show
        expect(assigns(:refresh_button_caption)).to eq('Refresh Repos')
      end

      it 'refresh_button_caption should be \'Refreshing\' when loading' do
        User.find(1234).tap do |user|
          user[:loading_repos] = true
          user.save
        end

        get :show
        expect(assigns(:refresh_button_caption)).to eq('Refreshing')
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
end
