module BuildsHelper
  def build_status(build_status)
    label_type = case build_status
                when /created/
                  build_status = append_spinner(build_status)
                  'label-warning status-created'
                when /building/
                  build_status = append_spinner(build_status)
                  'label-info status-building'
                when /failed/
                  'label-danger status-failed'
                when /completed/
                  'label-success status-completed'
                else
                  'label-danger status-other'
                end
    render 'shared/builds/build_status_label',
            status: raw(build_status), label_type: label_type
  end

  def append_spinner(status)
    "#{fa_icon('spinner spin')} #{status}"
  end
end
