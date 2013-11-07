class BooksController < ApplicationController
  before_filter :check_login

  def refresh
    book = Book.find_by_id(params[:book_id])
    book ? queue_update(book) : render_nothing(404)
  end

  def index
    @books = Book.includes(:repo, :manifest).where(user: user)
    @books = @books.keep_if {|book| book.repo && book.repo[:name]}

    render json: @books
  end

  def destroy
    Book.destroy(params[:id])
    redirect_to books_path
  end

  def show
    @book   = Book.find_by_id(params[:id])
    @book ? render(json: @book) : render_nothing(404)
  end

  def queue
    book = Book.find_by_id(params[:book_id])
    if book
      queue_build(params[:book_id])
      redirect_to book_path(params[:book_id])
    else
      render nothing: true, status: 404
    end
  end

  def builds
    @book = Book.find_by_id(params[:book_id])
    if @book
      render json: ::Build.where(book_id: @book[:id]).limit(5)
    else
      render nothing: true, status: 404
    end
  end

  private
  def queue_build(book_id)
    Kammic::Build.queue(book_id)
  end

  def queue_update(book)
    Github::ManifestQueue.enqueue_update book[:id]
    book.is_loading(true)
    redirect_to book_path(book)
  end
end
