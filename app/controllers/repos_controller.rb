class ReposController < ApplicationController
  include ReposHelper
  before_filter :check_login

  def index
    user = current_user
    @are_repos_loading      = user[:loading_repos]
    @refresh_button_caption = @are_repos_loading ? 'Refreshing' : 'Refresh Repos'
    @repo_book_ids = repo_book_ids(user[:id])
    @repos = Repo.where(user: user)
                  .order("pushed_at desc")
                  .paginate(:page => params[:page], :per_page => 25)
  end

  def refresh
    user = current_user
    user.queue_update_repos_from_github
    user.is_loading_repos(true)

    redirect_to repos_path
  end

  def follow
    repo   = Repo.find_by_id(params[:id])
    if repo
      Book.create(repo: repo, user: user)
      redirect_to repos_path
    else
      render nothing: true, status: 404
    end
  end
end
