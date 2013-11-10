class BuildAuthorizer < ApplicationAuthorizer
  def readable_by?(user)
    return false unless resource.book
    resource.book[:user_id] == user[:id]
  end
end
