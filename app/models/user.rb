# == Schema Information
#
# Table name: users
#
#  id            :integer          not null, primary key
#  uid           :string(255)
#  provider      :string(255)
#  name          :string(255)
#  auth_token    :string(255)
#  image_url     :string(255)
#  role          :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  login         :string(255)
#  loading_repos :boolean          default(FALSE)
#

class User < ActiveRecord::Base

  has_many :repos
  has_many :books

  validates_presence_of   :uid, :provider, :name, :auth_token
  validates_uniqueness_of :uid

  def self.create_with_omniauth(auth = {})
    return nil unless auth
    user       = User.new
    user.attributes = {
      provider:  auth['provider'],
      uid:       auth['uid'],
      login:     (auth['info'] && auth['info']['nickname'])  || nil,
      name:      (auth['info'] && auth['info']['name'])  || nil,
      image_url: (auth['info'] && auth['info']['image']) || nil,
      auth_token:(auth['credentials'] && auth['credentials']['token']) || nil,
      role:      'author'
    }

    user.save ? user : nil
  end

  def self.find_with_omniauth(auth = {})
    return nil unless auth && auth[:uid]
    User.where(uid: auth[:uid]).first
  end

  def queue_update_repos_from_github
    Github::RepoQueue.queue_update self.id
  end
end
