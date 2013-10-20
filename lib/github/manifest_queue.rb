require 'base64'
require 'yaml'

module Github
  class ManifestQueue
    class << self

      def enqueue_update(book_id)
        QC.enqueue("Github::ManifestQueue.update_from_github", book_id)
      end

      def update_from_github(book_id)
        book = Book.includes(:repo).find_by_id(book_id)
        return false unless book && book.repo

        manifest     = retrieve_manifest(book.repo[:full_name], 'manifest.yml')
        hash         = clean_hash(hash_from_content(manifest))
        hash[:book]  = book
        hash[:pages] = hash[:pages].to_s if hash[:pages]

        Manifest.delete(Manifest.find_by_book_id(book[:id]))
        Manifest.create(hash)
        book.is_loading(false)
      end

      def clean_hash(hash)
        Kammic::HashCleaner.clean(hash, Manifest.new.attributes.keys) || {}
      end

      def hash_from_content(content)
        YAML.load(content)
      end

      def retrieve_manifest(repo, path)
        decode(Octokit.contents(repo, :path => path).content)
      end

      private

      def decode(encoded)
        Base64.decode64(encoded)
      rescue
        ''
      end
    end
  end
end
