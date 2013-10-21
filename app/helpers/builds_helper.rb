module BuildsHelper
  def build_status(build_status)
    label_type = case build_status
                when /created/
                  'label-warning'
                when /building/
                  'label-info'
                when /failed/
                  'label-danger'
                when /completed/
                  'label-success'
                else
                  'label-danger'
                end
    render 'build_status_label', status: build_status, label_type: label_type
  end
end
