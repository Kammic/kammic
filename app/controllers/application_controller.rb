class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_attr :user

  private
  def user 
    @user ||= current_user
  end

  def current_user
    user_id = session[:user_id]
    user_id ? User.find(user_id) : nil
  rescue ActiveRecord::RecordNotFound
    nil
  end

  def check_login
    head :forbidden unless current_user
  end
end
