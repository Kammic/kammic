class Repo < ActiveRecord::Base
  validates_presence_of :user_id
  belongs_to :user
  has_one :book
end
