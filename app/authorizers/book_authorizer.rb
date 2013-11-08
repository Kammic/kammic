class BookAuthorizer < ApplicationAuthorizer
  def readable_by?(user)
    owner?(user)
  end

  def deletable_by?(user)
    owner?(user)
  end

  private
  def owner?(user)
    resource[:user_id] == user[:id]
  end
end
