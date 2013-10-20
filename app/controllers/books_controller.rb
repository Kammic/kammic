class BooksController < ApplicationController
  before_filter :check_login

  def refresh
    Github::Manifest.enqueue_update params[:book_id]
    redirect_to book_path(params[:book_id])
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
