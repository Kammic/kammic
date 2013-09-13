class OmniauthGithubController < ApplicationController
  protect_from_forgery with: :exception

  def callback
    auth    = request.env["omniauth.auth"]
    user = User.find_with_omniauth(auth) || User.create_with_omniauth(auth)

    if user
      session[:user_id] = user[:id]
      redirect_to editor_path
    else
      flash[:error] = 'A login error has occured'
      redirect_to user_login_path
    end

  end
end
