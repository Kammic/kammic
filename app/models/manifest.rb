# == Schema Information
#
# Table name: manifests
#
#  id          :integer          not null, primary key
#  title       :string(255)
#  cover_image :string(255)
#  pages       :text
#  book_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

# == Schema Information
#
# Table name: manifests
#
#  id          :integer          not null, primary key
#  title       :string(255)
#  cover_image :string(255)
#  pages       :hstore
#  book_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#
require 'json'

class Manifest < ActiveRecord::Base
  belongs_to :book

  def pages
    (eval(self[:pages])).with_indifferent_access
  end
end
