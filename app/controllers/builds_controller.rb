class BuildsController < ApplicationController
  before_filter :check_login, :json_format
  respond_to :json

  def index
    @builds = Build.user_builds(user[:id], params[:only])
    respond_with(@builds)
 end

  def show
    @build = Build.find_by_id(params[:id])
    if @build
      authorize_action_for(@build)
      respond_with(@build)
    else
      render_nothing(404)
    end
  end

end
