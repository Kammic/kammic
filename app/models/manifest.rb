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

class Manifest < ActiveRecord::Base
  belongs_to :book
end
