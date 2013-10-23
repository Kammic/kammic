class BuildsController < ApplicationController
  before_filter :check_login
  
  def index
    @builds = user_builds(user[:id]).order("started_at desc")
  end

  private
  def user_builds(user_id)
    Build.joins(:book).where(books: { user_id: user_id})
  end
end
