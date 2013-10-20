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
