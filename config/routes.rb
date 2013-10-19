Kammic::Application.routes.draw do
  
  # get '/editor', to: 'editor#index'
  root to: 'application#index'
  get '/user/login',  to: 'user#login'
  get '/user/logout', to: 'user#logout'
  get '/user/login/callback',  to: 'omniauth_github#callback'
  get '/auth/github/callback', to: 'omniauth_github#callback'

  resource :repos
  scope 'repos' do
    get '/:id/editor', to: 'editor#index',  as: :repo_editor
    get '/:id/build',  to: 'repos#build',   as: :repo_build
    get '/refresh',    to: 'repos#refresh', as: :refresh_repos
    get '/:id/add_as_book', to: 'repos#add_as_book', as: :add_repo_as_book
  end

  resource :books
end
