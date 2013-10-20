# == Schema Information
#
# Table name: books
#
#  id              :integer          not null, primary key
#  repo_id         :integer
#  user_id         :integer
#  cover_image_url :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#

require 'spec_helper'
