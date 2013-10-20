Kammic::Application.routes.draw do
  
  # get '/editor', to: 'editor#index'
  root to: 'application#index'
  get '/user/login',  to: 'user#login'
  get '/user/logout', to: 'user#logout'
  get '/user/login/callback',  to: 'omniauth_github#callback'
  get '/auth/github/callback', to: 'omniauth_github#callback'

  scope 'repos' do
    get '/', to: 'repos#index', as: :repos
    get '/refresh',    to: 'repos#refresh', as: :refresh_repos
    get '/:id/edit',   to: 'editor#index',  as: :repo_editor
    get '/:id/build',  to: 'repos#build',   as: :repo_build
    get '/:id/follow', to: 'repos#follow',  as: :follow
  end

  resources :books, only: [:index, :destroy, :show] do
    get '/refresh', to: 'books#refresh', as: :refresh
  end

end
