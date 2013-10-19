class ReposController < ApplicationController
  before_filter :check_login

  def show
    @refresh_button_caption = user[:loading_repos] ? 'Refreshing' : 'Refresh Repos'
    @repos = Repo.where(user_id: user[:id]).order("pushed_at desc")
  end

  def refresh
    user.queue_update_repos_from_github
    user[:loading_repos] = true
    user.save

    redirect_to repos_path
  end
end
