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

require 'spec_helper'

describe Build do
  pending "add some examples to (or delete) #{__FILE__}"
end
