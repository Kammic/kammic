class BuildsController < ApplicationController
  before_filter :check_login
  
  def index
    @builds = user_builds(user[:id])
                  .order("started_at desc")
                  .paginate(:page => params[:page], :per_page => 25)
  end

  private
  def user_builds(user_id)
    Build.joins(:book).where(books: { user_id: user_id})
  end
end
