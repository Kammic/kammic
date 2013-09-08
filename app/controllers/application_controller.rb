class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  private
  def current_user
    user_id = session[:user_id]
    user_id ? User.find(user_id) : nil
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
