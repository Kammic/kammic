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

class Build < ActiveRecord::Base
  belongs_to :book
  has_one :user, through: :book
  validates_presence_of   :book_id

  default_scope { order("started_at desc") }
end
