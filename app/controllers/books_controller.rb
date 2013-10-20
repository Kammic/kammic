class BooksController < ApplicationController
  before_filter :check_login

  def refresh
    book = Book.find_by_id(params[:book_id])
    if book
      Github::Manifest.enqueue_update book[:id]
      book[:loading_manifest] = true
      book.save
      redirect_to book_path(book)
    else
      render nothing: true, status: 404
    end
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
    @book  = Book.includes(:repo, :manifest).find_by_id(params[:id])
    render nothing: true, status: 404 unless @book
  end
end
