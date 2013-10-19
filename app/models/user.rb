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
    QC.enqueue("Github::RepoQueue.update_from_github", self.id)
  end
end
