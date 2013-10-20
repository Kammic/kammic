# == Schema Information
#
# Table name: repos
#
#  id            :integer          not null, primary key
#  name          :string(255)
#  full_name     :string(255)
#  description   :text
#  private       :boolean
#  clone_url     :string(255)
#  master_branch :string(255)
#  pushed_at     :datetime
#  user_id       :integer
#  created_at    :datetime
#  updated_at    :datetime
#  html_url      :string(255)
#

class Repo < ActiveRecord::Base
  validates_presence_of :user_id
  belongs_to :user
  has_one :book
end
