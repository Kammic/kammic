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
      build1 = Build.create!(id: 1, started_at: time+5, book_id: 1)
      build2 = Build.create!(id: 2, started_at: time+1, book_id: 1)
      build3 = Build.create!(id: 3, started_at: time+3, book_id: 1)

      builds = Build.all
      expect(builds).to eq([build1, build3, build2])
    end
  end
end
