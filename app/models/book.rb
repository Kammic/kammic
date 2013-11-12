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
  include Authority::Abilities

  belongs_to :repo
  belongs_to :user

  has_one :manifest
  has_many :builds

  validates :repo_id, :uniqueness => { :scope => :user_id }

  def is_loading(value)
    self.reload
    self.loading_manifest = value
    self.save
  end

  def is_loading?
    self.loading_manifest || false
  end
end
