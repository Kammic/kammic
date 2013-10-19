module ReposHelper
  def follow_button_class(is_book)
    'disabled' if is_book
  end

  def repo_book_ids(user_id)
    [].tap do |repo_ids|
      Book.where(user_id: user_id).each do |book|
        repo_ids << book[:repo_id]
      end
    end
  end
end
