class EditorController < ApplicationController
  def index
    @current_user = current_user
    @repo_name    = params[:id]
  end
end
