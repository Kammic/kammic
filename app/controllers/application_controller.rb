class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_attr :user

  private
  def render_nothing(status)
    render nothing: true, status: 404
  end
  
  def user
    @user ||= current_user
  end

  def current_user
    User.find_by_id(session[:user_id])
  end

  def check_login
    head :forbidden unless current_user
  end
end
