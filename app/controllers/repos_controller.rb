class ReposController < ApplicationController
  before_filter :check_login

  def show
    @repos = Repo.where(user_id: current_user[:id]).order("pushed_at desc")
  end

  def refresh
    current_user.queue_update_repos_from_github
    redirect_to repos_path
  end
end
