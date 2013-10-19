class ReposController < ApplicationController
  include ReposHelper
  before_filter :check_login

  def index
    @refresh_button_caption = user[:loading_repos] ? 'Refreshing' : 'Refresh Repos'
    @repo_book_ids = repo_book_ids(user[:id])
    @repos = Repo.where(user_id: user[:id]).order("pushed_at desc")
  end

  def refresh
    user.queue_update_repos_from_github
    user[:loading_repos] = true
    user.save

    redirect_to repos_path
  end

  def add_as_book
    repo   = Repo.find_by_id(params[:id])
    if repo
      Book.create(repo: repo, user: user)
      redirect_to repos_path
    else
      render nothing: true, status: 404
    end
  end
end
