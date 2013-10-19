class BooksController < ApplicationController
  def index 
    @books = Book.includes(:repo).where(user: user)
  end

  def destroy
    Book.destroy(params[:id])
    redirect_to books_path
  end
end
