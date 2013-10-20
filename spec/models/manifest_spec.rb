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

require 'spec_helper'

describe Manifest do
  it 'converts pages to a hash' do
    manifest = Manifest.new(pages: "{something_true: '1234'}")
    expect(manifest.pages["something_true"]).to eq('1234')
  end
end
