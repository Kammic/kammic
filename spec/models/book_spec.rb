# == Schema Information
#
# Table name: books
#
#  id               :integer          not null, primary key
#  repo_id          :integer
#  user_id          :integer
#  cover_image_url  :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#  loading_manifest :boolean          default(FALSE)
#

require 'spec_helper'

describe Book do

  context '#active_builds' do
    it 'returns active builds with this book' do
      book = Book.create!(id: 55, user_id: 1234, repo_id: 42)
      create_build(book_id: 55, status: 'building')
      create_build(book_id: 55, status: 'created')
      create_build(book_id: 55, status: 'completed')
      expect(book.active_builds.count).to eq(2)
    end
  end

  context '#is_loading?' do
    it 'returns the books loading status' do 
      book = Book.create!(id: 55, user_id: 1234, repo_id: 42)
      expect(book.is_loading?).to eq(false)

      book.loading_manifest  = true
      expect(book.is_loading?).to eq(true)
    end
  end

  context '#is_loading' do
    it 'sets the loading_manifest field to passed in value' do
      create_user(id: 1234)
      create_repo("user" => User.find(1234))
      Book.create!(id: 55, user_id: 1234, repo_id: 42)

      book = Book.find_by_id(55)

      book.is_loading(true)
      book.reload
      expect(book[:loading_manifest]).to eq(true)

      book.is_loading(true)
      book.reload
      expect(book[:loading_manifest]).to eq(true)
    end
  end
end
