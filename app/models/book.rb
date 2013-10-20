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

class Book < ActiveRecord::Base
  validates :repo_id, uniqueness: true  
  belongs_to :repo
  belongs_to :user

  has_one :manifest
end
