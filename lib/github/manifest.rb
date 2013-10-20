require 'base64'
require 'yaml'

module Github
  class Manifest
    class << self

      def enqueue_update(book_id)
        QC.enqueue("Github::Manifest.update_from_github", book_id)
      end

      def update_from_github(book_id)
        book = Book.includes(:repo).find_by_id(book_id)
        return false unless book && book.repo

        manifest    = retrieve_manifest(book.repo[:full_name], 'manifest.yml')
        hash        = clean_hash(hash_from_content(manifest)) || {}
        hash[:book] = book

        ::Manifest.delete(::Manifest.find_by_book_id(book[:id]))
        ::Manifest.create(hash)
        book[:loading_manifest] = false
        book.save
      end

      def clean_hash(hash)
        hash         = hash.with_indifferent_access
        clean_hash   = {}.with_indifferent_access
        allowed_keys = ::Manifest.new.attributes.keys
        allowed_keys.each do |key|
          if key == 'pages'
            clean_hash[key] = hash[key].to_s
          else
            clean_hash[key] = hash[key]
          end
        end
        clean_hash
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
