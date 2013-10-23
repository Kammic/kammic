module Kammic
  class Build
    class << self
      def queue(book_id)
        book = find_book(book_id)
        return false unless book
        QC.enqueue("Kammic::Build.update", book_id)
        create_build(book_id: book_id)
      end

      def update(book_id)
        build = ::Build.find_by_book_id(book_id)
        build.update_attributes(last_commit_info(book_id))
        build.save
        QC.enqueue("Kammic::Build.execute", book_id)
      end

      def execute(book_id)
        book = find_book(book_id)
        return false unless book

        build = ::Build.where(status: :created, book_id: book_id).first
        build_book(book_id)
        complete_build(build)
      rescue Exception => e
        fail_build(build)
      end

      private
      def build_book(book_id)
        # some_method
      end

      def last_commit_info(book_id)
        book = find_book(book_id)
        last_commit = Octokit.commits(book.repo.full_name).last
        {author:         last_commit.commit.author.name,
         revision:       last_commit.sha,
         commit_message: last_commit.commit.message,
         branch:         'master'}
      end

      def fail_build(build)
        build.reload
        build.status   = :failed
        build.ended_at = Time.now
        build.save
      end

      def complete_build(build)
        build.reload
        build.status = :completed
        build.ended_at = Time.now
        build.save
      end

      def find_book(book_id)
        Book.find_by_id(book_id)
      end

      def create_build(hash)
        hash = { started_at: Time.now, status: 'created'}.merge(hash)
        ::Build.create(hash)
      end
    end
  end
end
