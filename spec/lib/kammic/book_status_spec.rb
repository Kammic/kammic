require 'spec_helper'

describe Kammic::BookStatus do
  before do
    create_user(id: 1234)
    create_repo(user_id: 1234)
    create_book(id: 55, user_id: 1234, repo_id: 42)
    create_build(book_id: 55)

    @book   = Book.find(55)
    @status = Kammic::BookStatus.new(@book)
  end

  let(:subject){ Kammic::BookStatus }

  context '#refreshing?' do
    it 'returns the books refresh status' do
      expect(@status.is_loading?).to eq(false)

      @book.loading_manifest = true
      expect(@status.is_loading?).to eq(true)
    end
  end
  context '#status' do
    before do
      @hash = @status.status
    end

    it 'returns if the book is refreshing' do 
      expect(@hash["refreshing"]).to eq(false)
    end

    it 'returns the statuses as an array' do
      builds = @hash["builds"] 
      expect(builds.count).to eq(1)
    end
  end

  context '#build_status' do
    it 'returns a hash of statuses for each build' do
      Build.create!(id: 2, book_id: 55, status: "failed")
      Build.create!(id: 3, book_id: 55, status: "complete")
      expected =  [
        {id: anything, status: "complete"},
        {id: 2, status: "failed"},
        {id: 3, status: "complete"},
      ] 
      expect(@status.build_status).to eq(expected)
    end

    it 'limits the statuses to only return 5' do 
      20.times { Build.create(book_id: 55, status: "failed") }
      expect(@status.build_status.count).to eq(5)
    end

  end

end
