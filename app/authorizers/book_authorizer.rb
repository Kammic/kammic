class BookAuthorizer < ApplicationAuthorizer
  def readable_by?(user)
    owner?(user)
  end

  def deletable_by?(user)
    owner?(user)
  end

end
