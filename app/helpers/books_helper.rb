module BooksHelper
  def build_button(book)
    render 'shared/books/build_button', path: book_queue_build_path(book)
  end

  def edit_book_button(book)
    render 'shared/books/edit_book_button', path: repo_editor_path(book.repo[:name])
  end

  def unfollow_button(book)
    render 'shared/books/unfollow_button', path: book_path(book)
  end

  def book_pages(pages)
    render 'shared/books/book_pages', pages: pages
  end

  def book_image(book)
    render 'shared/books/book_image', image: book_image_url(book)
  end

  def refresh_manifest_button(book)
    caption   = is_loading(book) ? "#{fa_icon('spinner spin')} Loading" : 'Refresh from Github'
    css_class = is_loading(book) ? 'btn-warning' : 'btn-primary'
    path      = book_refresh_path(book)
    render 'shared/books/refresh_manifest_button', caption: caption.html_safe, css_class: css_class, path:path
  end

  private

  def table_of_contents(page, value, indent = 0)
    output = ""
    if value.kind_of? Hash
      value.each do |k, v|
        output << render('shared/books/book_page', title: page, path: '#', indent: indent)
        output << table_of_contents(k, v, indent+1)
      end
    else
      output << render('shared/books/book_page', title: page, path: value, indent: indent)
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
