class BooksController < ApplicationController
  def show 
    @books = Book.includes(:repo).where(user: user)
  end
end
