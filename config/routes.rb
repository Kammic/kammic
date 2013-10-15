Kammic::Application.routes.draw do
  
  # get '/editor', to: 'editor#index'
  root to: 'application#index'
  get '/user/login',  to: 'user#login'
  get '/user/logout', to: 'user#logout'
  get '/user/login/callback',  to: 'omniauth_github#callback'
  get '/auth/github/callback', to: 'omniauth_github#callback'

  resource :repos
  get '/repos/:id/editor', to: 'editor#index', as: :repo_editor
  get '/repos/refresh', to: 'repos#refresh', as: :refresh_repos

end
