module BooksHelper

  def book_image(book)
    render 'book_image', image: book_image_url(book)
  end

  def refresh_manifest_button(book)
    caption   = is_loading(book) ? '<i class="icon-spinner icon-spin"></i> Loading' : 'Refresh from Github'
    css_class = is_loading(book) ? 'btn-warning' : 'btn-primary'
    path      = book_refresh_path(book)
    render 'refresh_manifest_button', caption: caption.html_safe, css_class: css_class, path:path
  end

  private

  def book_image_url(book)
    if book.manifest.cover_image
      "https://raw.github.com/#{book.repo.full_name}/master/#{book.manifest.cover_image}"
    else
      'http://placehold.it/300x400'
    end
  end

  def is_loading(book)
    book[:loading_manifest] 
  end
end
