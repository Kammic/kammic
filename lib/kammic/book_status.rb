module Kammic
  class BookStatus
    attr_reader :book

    def initialize(book)
      @book = book
    end

    def is_loading?
      @book.is_loading?
    end

    def status
      {
        refreshing: is_loading?,
        builds:     build_status
      }.with_indifferent_access
    end

    def to_json
      status.to_json
    end

    def build_status
      [].tap do |status|
        builds.each do |build|
          status << {id: build[:id], status: builds_status(build.status)}
        end #each
      end #tap
    end #def

    private
    def builds_status(status)
      status || "complete"
    end

    def builds
      ::Build.where(book_id: @book[:id]).limit(5)
    end
  end
end
