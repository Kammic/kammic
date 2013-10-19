require 'spec_helper'

describe ReposHelper do
  context '#repo_book_ids' do
    it 'returns an array of all the users repos which are already books' do
      5.times { |x| Book.create!(user_id: 5, repo_id: x+1) }
      expect(helper.send(:repo_book_ids, 5)).to eq([1,2,3,4,5])
    end
  end
end
