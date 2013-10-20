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

  describe '#refresh' do
    before do
      session[:user_id] = 1234
      create_user(id: 1234)

      create_repo("user" => User.find(1234))
      Book.create!(id: 55, user_id: 1234, repo_id: 42)
    end

    it 'redirects you back to the book path' do
      expect(get :refresh, book_id: 55).to redirect_to book_path(55)
    end

    it 'calls Github::ManifestQueue.enqueue_update' do
      Github::ManifestQueue.should_receive(:enqueue_update).with(55)
      get :refresh, book_id: 55
    end

    it 'sets the loading_manifest to true' do
      get :refresh, book_id: 55
      expect(Book.find_by_id(55)[:loading_manifest]).to eq(true)
    end

    it 'gives 404 if book is not found' do
      get :refresh, book_id: 199
      assert_response :missing
    end
  end

  describe '#show' do
    before do
      session[:user_id] = 1234
      create_user(id: 1234)

      create_repo("user" => User.find(1234))
      Book.create!(id: 55, user_id: 1234, repo_id: 42)
      Manifest.create!(book_id: 55, title: 'something')
    end

    it '404s when book is not present' do
      get :show, id: 000
      assert_response :missing
    end

    it 'reads the right book' do
      get :show, id: 55
      expect(assigns(:book)[:id]).to eq(55)
    end

    it 'gets the manifest and repo relationship' do
      get :show, id: 55

      book = assigns(:book)
      expect(assigns(:book).manifest).to_not be_nil
      expect(assigns(:book).repo).to_not be_nil
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
      create_repo("user" => User.find(1234))
      Book.create!(user_id: 1234, repo_id: 42)
      Book.create!(user_id: 1234, repo_id: 41)
      Book.create!(user_id: 1234, repo_id: 40)
      get :index
      expect(assigns(:books).count).to eq(1)
    end
  end
end
