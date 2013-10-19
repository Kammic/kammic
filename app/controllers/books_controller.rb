class BooksController < ApplicationController
  before_filter :check_login

  def index
    @books = Book.includes(:repo).where(user: user)
    @books = @books.keep_if {|book| book.repo && book.repo[:name]}
  end

  def destroy
    Book.destroy(params[:id])
    redirect_to books_path
  end

  def show
    @book = Book.includes(:repo).find_by_id(params[:id])
    render nothing: true, status: 404 unless @book
  end
end
