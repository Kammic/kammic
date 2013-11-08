class BooksController < ApplicationController
  before_filter :check_login, :json_format
  respond_to :json

  authority_actions builds: :read, queue: :read, refresh: :read

  def refresh
    book = Book.find_by_id(params[:book_id])
    if book
      authorize_action_for(book)
      queue_update(book)
    else
      render_nothing(404)
    end
  end

  def index
    @books = Book.includes(:repo, :manifest).where(user: user)
    @books = @books.keep_if {|book| book.repo && book.repo[:name]}
    respond_with @books
  end

  def destroy
    book = Book.find_by_id(params[:id])
    if book
      authorize_action_for(book)
      Book.destroy(params[:id])
      redirect_to books_path
    else
      render_nothing(404)
    end
  end

  def show
    @book   = Book.find_by_id(params[:id])
    authorize_action_for(@book) if @book

    @book ? render(json: @book) : render_nothing(404)
  end

  def queue
    book = Book.find_by_id(params[:book_id])
    if book
      authorize_action_for(book)
      queue_build(params[:book_id])
      redirect_to book_path(params[:book_id])
    else
      render_nothing(404)
    end
  end

  def builds
    @book = Book.find_by_id(params[:book_id])
    if @book
      authorize_action_for(@book) if @book
      render json: ::Build.where(book_id: @book[:id]).limit(5)
    else
      render_nothing(404)
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
