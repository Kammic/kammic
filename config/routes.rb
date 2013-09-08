Kammic::Application.routes.draw do
  root to: 'editor#index'
  get '/user/login',  to: 'user#login'
  get '/user/logout', to: 'user#logout'
  get '/user/login/callback',  to: 'omniauth_github#callback'
  get '/auth/github/callback', to: 'omniauth_github#callback'
end
