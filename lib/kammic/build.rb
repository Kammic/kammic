module Kammic
  class Build
    class << self
      def queue(book_id)
        book = Book.find_by_id(book_id)
        return false unless book
        build = create_build(book_id: book_id)
        QC.enqueue("Kammic::Build.update", build[:id])
      end

      def update(build_id)
        update_with_commit_info(build_id)
        QC.enqueue("Kammic::Build.execute", build_id)
      end

      def execute(build_id)
        build = ::Build.find_by_id(build_id)
        book  = Book.find_by_id(build[:book_id])
        return false unless book

        build_book(book)
        complete_build(build)
      rescue Exception => e
        fail_build(build)
      end

      private
      def update_with_commit_info(build_id)
        build = ::Build.find_by_id(build_id)
        build.update_attributes(last_commit_info(build[:book_id]))
        build.save
      end

      def build_book(book)
        # some_method
      end

      def last_commit_info(book_id)
        book = Book.find_by_id(book_id)
        last_ref    = Octokit.refs(book.repo.full_name).last.object.sha
        last_commit = Octokit.commit(book.repo.full_name, last_ref)
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

      def create_build(hash)
        hash = { started_at: Time.now, status: 'created'}.merge(hash)
        ::Build.create(hash)
      end
    end
  end
end
