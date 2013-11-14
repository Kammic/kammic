Kammic::Application.routes.draw do


  root to: 'application#index'
  get '/user',        to: 'user#show'
  get '/user/login',  to: 'user#login'
  get '/user/logout', to: 'user#logout'
  get '/user/login/callback',  to: 'omniauth_github#callback'
  get '/auth/github/callback', to: 'omniauth_github#callback'

  scope 'repos' do
    get '/', to: 'repos#index', as: :repos
    get '/refresh',    to: 'repos#refresh', as: :refresh_repos
    get '/:id/build',  to: 'repos#build',   as: :repo_build
    get '/:id/follow', to: 'repos#follow',  as: :follow
    #get '/:id/edit',   to: 'Editor::editor#index',  as: :repo_editor
  end

  mount Editor::Engine,  at: "/editor/:id", as: :repo_editor
  mount Browser::Engine, at: "/browser", as: :browser

  resources :books, only: [:index, :destroy, :show], defaults: {format: :json} do
    get '/refresh',       to: 'books#refresh', as: :refresh
    get '/builds',        to: 'books#builds', as: :builds
    get '/build',   to: 'books#queue'
  end

  resources :builds, only: [:index, :show]

end
