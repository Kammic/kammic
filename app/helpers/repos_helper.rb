module ReposHelper

  def repo_type(is_private)
    caption = is_private ? 'Private' : 'Public'
    button_type = is_private ? 'btn-warning' : 'btn-success'
    render 'private_label', caption: caption, button_type: button_type
  end

  def follow_button(repo, user)
    repo_book_ids = repo_book_ids(user[:id])
    css_class     = follow_button_class(repo_book_ids.include? repo[:id])
    button_type   = repo_book_ids.include?(repo[:id]) ? 'btn-info' : 'btn-success'
    path          = follow_path(repo[:id])
    render 'follow_button', path: path, css_class: css_class, button_type: button_type
  end

  def follow_button_class(is_book)
    is_book ? 'disabled' : ''
  end

  def load_repos_button(are_repos_loading, caption)
    css_class = are_repos_loading ? 'btn-warning' : 'btn-primary'
    caption   = are_repos_loading ? '<i class="icon-spinner icon-spin"></i> ' + caption : caption
    render 'load_repos_button', caption: caption.html_safe, css_class: css_class
  end

  def repo_book_ids(user_id)
    [].tap do |repo_ids|
      Book.where(user_id: user_id).each do |book|
        repo_ids << book[:repo_id]
      end
    end
  end
end
