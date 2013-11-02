require 'spec_helper'

describe BuildsController do
  before { create_user(id: 1234) }

  context 'filters' do
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

  context '#show' do
    before do
      session[:user_id] = 1234
    end

    it 'sets @build' do
      Book.create!(id: 99, user_id: 1234, repo_id: 42)
      Build.create(id: 42, book_id: 55)
      get :show, id: 42
      expect(assigns(:build)).to_not be_nil
    end 

    it 'returns 404 when a build is not found' do
      get :show, id: 5000
      assert_response :missing
    end
  end 

  context '#index' do
    before do
      session[:user_id] = 1234
    end

    it 'assigns builds' do
      get :index
      expect(assigns(:builds)).to_not be_nil
    end

    it 'finds all the users builds' do
      Book.create!(id: 55, user_id: 1234, repo_id: 42)
      Book.create!(id: 56, user_id: 1235, repo_id: 43)

      Build.create(book_id: 55)
      Build.create(book_id: 55)
      Build.create(book_id: 56)

      get :index
      expect(assigns(:builds).count).to eq(2)
    end

    context '.json' do
      it 'filters down to only a few ids w/ param only' do
        Book.create!(id: 55, user_id: 1234, repo_id: 42)
        10.times { |i| Build.create(id: i, book_id: 55) }
        get :index, only: [1,2]

        builds = assigns(:builds)
        expect(builds.count).to eq(2)
        builds.each do |build|
          expect([1,2]).to include(build[:id])
        end
      end
    end
  end
end
