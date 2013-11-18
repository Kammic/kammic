require 'securerandom'

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
        building_build(build_id)
        QC.enqueue("Kammic::Build.execute", build_id)
      end

      def execute(build_id)
        build = ::Build.find_by_id(build_id)
        book  = Book.find_by_id(build[:book_id])
        return false unless book

        paths = build_book(book, build)
        urls  = upload_book(paths)
        complete_build(build, urls)
      rescue Exception => e
        Rails.logger.info "Book build error: #{e.inspect}"
        fail_build(build)
      end

      private
      def update_with_commit_info(build_id)
        build = ::Build.find_by_id(build_id)
        build.update_attributes(last_commit_info(build[:book_id]))
        build.save
      end

      def build_book(book, build)
        {}.tap do |generated_files|
          formats.each do |format|
            file_name = "#{build.revision}.#{format}"
            generate local:  tmp_path,
              remote: book.repo.clone_url,
              output: "/tmp/#{file_name}"
            generated_files[file_name] = "/tmp/#{file_name}"
          end
        end
      ensure
        FileUtils.rm_rf tmp_path
      end

      def formats
        ['pdf', 'Mobi', 'epub']
      end

      def upload_book(paths)
        bucket = s3_bucket
        urls   = {}
        paths.map do |upload_path, local_path|
          object = bucket.objects.build(upload_path)
          object.content = open_file(local_path)
          object.save
          urls[upload_path] = object.url
        end
        urls
      end

      def open_file(*args)
        open(*args)
      end

      def s3_bucket
        service = S3::Service.new(access_key_id:     Rails.application.config.s3_access_key,
                                  secret_access_key: Rails.application.config.s3_secret)
        service.buckets.find(Rails.application.config.s3_bucket)
      end

      def tmp_path
        "/tmp/#{SecureRandom.uuid}"
      end

      def generate(*args)
        generator(*args).generate
      end

      def generator(*args)
        Lana::BookGenerator.new(*args)
      end

      def last_commit_info(book_id)
        book = Book.find_by_id(book_id)
        last_ref    = Octokit.refs(book.repo.full_name).last.object.sha
        last_commit = Octokit.commit(book.repo.full_name, last_ref)
        {author:         last_commit.commit.author.name,
         revision:       last_commit.sha,
         commit_message: last_commit.commit.message,
         additions:      last_commit.stats.additions,
         deletions:      last_commit.stats.deletions,
         branch:         'master'}
      end

      def building_build(build_id)
        book = ::Build.find_by_id(build_id)
        book[:status] = :building
        book.save
      end

      def fail_build(build)
        build.reload
        build.status   = :failed
        build.ended_at = Time.now
        build.save
      end

      def complete_build(build, urls = {})
        build.reload
        build.assets = urls
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
