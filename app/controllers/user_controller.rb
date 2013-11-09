class UserController < ApplicationController
  protect_from_forgery with: :exception
  before_filter :json_format
  def show
    render_nothing(404) and return unless user
    @user = user
  end

  def login; end

  def logout
    session[:user_id] = nil
    reset_session
    redirect_to user_login_path
  end
end
