class ReposController < ApplicationController
  before_filter :check_login

  def show
    @repos = Repo.where(user_id: current_user[:id])
  end
end
