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

        manifest = retrieve_manifest(book.repo[:full_name], 'manifest.yml')

        yaml = hash_from_content(manifest)
        yaml = {} unless yaml
        hash        = clean_hash(yaml)
        hash[:book] = book

        manifest_const.delete(manifest_const.find_by_book_id(book[:id]))
        manifest_const.create(hash)
      end

      def clean_hash(hash)
        hash         = hash.with_indifferent_access
        clean_hash   = {}.with_indifferent_access
        allowed_keys = manifest_const.new.attributes.keys
        allowed_keys.each do |key|
          clean_hash[key] = hash[key] if hash[key]
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
      def manifest_const
        ::Manifest
      end

      def decode(encoded)
        Base64.decode64(encoded)
      rescue
        ''
      end
    end
  end
end
