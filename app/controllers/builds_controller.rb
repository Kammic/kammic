class BuildsController < ApplicationController
  before_filter :check_login

  def index
    @builds = Build.user_builds(user[:id], params[:only])
                .paginate(:page => params[:page], :per_page => 25)

    respond_to do |format|
        format.html
        format.json { render json: @builds }
    end
  end

  def show
    @build = Build.find_by_id(params[:id])
    if @build
      render :show
    else
      render nothing: true, status: 404
    end
  end

end
