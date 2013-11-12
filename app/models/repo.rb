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
  include Authority::Abilities

  validates_presence_of :user_id
  belongs_to :user
  has_one :book

  validates :github_id, :uniqueness => {:scope => :user_id}

  default_scope { order("pushed_at desc") }

  def short_description
    return unless description
    return description if description.length < 75 
    "#{description[0..125]}..."
  end
end
