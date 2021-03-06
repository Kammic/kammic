class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_attr :user

  private
  def json_format
    request.format = "json"
  end

  def render_nothing(status = 404)
    render nothing: true, status: status
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
