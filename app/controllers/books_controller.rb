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
    @book   = Book.find_by_id(params[:id])
    if @book && @book.manifest
      @builds = Build.where(book: @book).limit(5)
      render :show
    elsif @book
      render :refreshing
    else
      render_nothing 404
    end
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

  def book_status
    book = Book.find_by_id(params[:book_id])
    if book
      render json: Kammic::BookStatus.new(book).to_json
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
