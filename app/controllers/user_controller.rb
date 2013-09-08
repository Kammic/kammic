class UserController < ApplicationController
  protect_from_forgery with: :exception

  def login; end

  def logout
    reset_session
    redirect_to user_login_path
  end
end
