class BooksController < ApplicationController
  before_filter :check_login

  def refresh
    book = Book.find_by_id(params[:book_id])
    book ? queue_update(book) : render_nothing(404)
  end

  def index
    @books = Book.includes(:repo, :manifest).where(user: user)
    @books = @books.keep_if {|book| book.repo && book.repo[:name]}
  end

  def destroy
    Book.destroy(params[:id])
    redirect_to books_path
  end

  def show
    @book  = Book.find_by_id(params[:id])
    if @book && @book.manifest
      render :show
    elsif @book
      render :refreshing
    else
      render_nothing 404
    end
  end

  private
  def queue_update(book)
    Github::Manifest.enqueue_update book[:id]
    book.is_loading(true)
    redirect_to book_path(book)
  end
end
