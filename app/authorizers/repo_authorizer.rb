class RepoAuthorizer < ApplicationAuthorizer
  def readable_by?(user)
    owner?(user)
  end
end
