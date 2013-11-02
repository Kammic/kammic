# == Schema Information
#
# Table name: builds
#
#  id             :integer          not null, primary key
#  status         :string(255)
#  branch         :string(255)
#  commit_message :string(255)
#  author         :string(255)
#  revision       :string(255)
#  started_at     :datetime
#  ended_at       :datetime
#  assets         :hstore
#  book_id        :integer
#  created_at     :datetime
#  updated_at     :datetime
#

require 'spec_helper'

describe Build do
  context '#default_scope' do
    it 'orders by the build date' do
      time   = Time.now
      build1 = create_build(id: 1, started_at: time+5, book_id: 1)
      build2 = create_build(id: 2, started_at: time+1, book_id: 1)
      build3 = create_build(id: 3, started_at: time+3, book_id: 1)

      builds = Build.all
      expect(builds).to eq([build1, build3, build2])
    end
  end

  context 'user_builds scope' do
    before do
      create_user(id: 1234)
      create_repo(user_id: 1234)
      Book.create!(id: 55, user_id: 1234, repo_id: 42)
    end

    it 'gets all of the users builds' do
      create_build(book_id: 55)
      create_build(book_id: 55)
      expect(Build.user_builds(1234).count).to eq(2)
    end

    it 'filters down to only a few ids w/ param only' do
      create_build(id: 1, book_id: 55)
      create_build(id: 2, book_id: 55)
      create_build(id: 3, book_id: 55)
      create_build(id: 4, book_id: 55)

      builds = Build.user_builds(1234, [2,4])
      expect(builds.count).to eq(2)

      builds.each do |build|
        expect([2,4].include?(build[:id])).to eq(true)
      end
    end

    it 'it returns only those records that are requested' do
      create_build(id: 1, book_id: 55)
      expect(Build.user_builds(1234, [1,2]).count).to eq(1)
    end
  end
end
