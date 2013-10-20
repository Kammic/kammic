module BooksHelper

  def book_pages(pages)
    render 'book_pages', pages: pages
  end

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

  def table_of_contents(page, value, indent = 0)
    output = ""
    if value.kind_of? Hash
      value.each do |k, v|
        output << render('book_page', title: page, path: '#', indent: indent)
        output << table_of_contents(k, v, indent+1)
      end
    else
      output << render('book_page', title: page, path: value, indent: indent)
    end
    output.html_safe
  end

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
