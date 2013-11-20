class ReposController < ApplicationController
  include ReposHelper
  before_filter :check_login, :json_format
  respond_to :json

  authority_actions follow: :read
  def index
    @loading_repos = user[:loading_repos]
    @repos             = Repo.includes(:book).where(user: user).order("pushed_at desc")
    @repo_book_ids     = repo_book_ids(user[:id])

    respond_with @repos
  end

  def refresh
    user = current_user
    user.queue_update_repos_from_github
    user.is_loading_repos(true)

    redirect_to repos_path
  end

  def follow
    repo = Repo.find_by_id(params[:id])
    if repo
      authorize_action_for(repo)
      Book.create(repo: repo, user: user)
      render nothing: true, status: 200
    else
      render nothing: true, status: 404
    end
  end
end
