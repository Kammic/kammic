require 'spec_helper'

describe BooksController do
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

  context '#queue' do
    before do
      session[:user_id] = 1234
      create_user(id: 1234)

      create_repo("user" => User.find(1234))
      Book.create!(id: 55, user_id: 1234, repo_id: 42)
      stub_const "Kammic::Build", double("Kammic::Build").as_null_object
    end

    it 'returns missing when book is not found' do
      get :queue, book_id: 123544
      assert_response :missing
    end

    it 'calls queue on Kammic::Build with the books id' do
      Kammic::Build.should_receive(:queue).with('55')
      get :queue, book_id: 55
    end

    it 'should redirect after queueing the build' do
      get :queue, book_id: 55
      assert_response :redirect
    end
  end

  context '#refresh' do
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

  context '#show' do
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

    it 'sets the builds to the books builds' do
      3.times { Build.create!(book_id: 55) }
      get :show, id: 55

      builds = assigns(:builds)
      expect(builds).to_not be_nil
      expect(builds).to_not be_empty
      expect(builds.count).to eq(3)
    end
  end

  context '#book_status' do
    before do 
      session[:user_id] = 1234
      create_user(id: 1234)
      Book.create!(id: 55, user_id: 1234, repo_id: 42)
    end

    it 'returns 404 when a book is not found' do
      get :book_status, book_id: 42 
      assert_response :missing
    end

    it 'gets the status of a book' do
      get :book_status, book_id: 55
      assert_response :success
    end
  end

  context '#index' do
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
