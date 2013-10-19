class Book < ActiveRecord::Base
  validates :repo_id, uniqueness: true  
  belongs_to :repo
  belongs_to :user
end
