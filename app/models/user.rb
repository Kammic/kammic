class User < ActiveRecord::Base

  has_many :repos

  validates_presence_of   :uid, :provider, :name, :auth_token
  validates_uniqueness_of :uid

  def self.create_with_omniauth(auth = {})
    return nil unless auth
    user       = User.new
    user.attributes = {
      provider:  auth['provider'],
      uid:       auth['uid'],
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

  def update_repos_from_github 
    github_repos = Github::RepoFinder.find_repos(auth_token)
    github_repos.each do |github_repo|
      repo = Repo.new(github_repo)
      repo.user_id = self.id
      repo.save
    end
  end

end
