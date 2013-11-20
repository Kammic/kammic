module Github
  class RepoQueue
    class << self

      def queue_update(user_id)
        QC.enqueue("Github::RepoQueue.update_from_github", user_id)
      end

      def update_from_github(user_id)
        user = User.find_by_id(user_id)
        return false unless user && user.auth_token

        github_repos = Github::RepoFinder.find_repos(user.auth_token)
        github_repos.each do |github_repo|
          create_from_hash github_repo, user_id
        end

        user.is_loading_repos(false)
      end

      private
      def create_from_hash(hash, user_id)
        repo = Repo.new(hash)
        repo.user_id   = user_id
        repo.github_id = hash["id"]
        deleted_id     = delete_if_exists(hash["id"])
        repo.id        = deleted_id
        repo.save
      end

      def delete_if_exists(github_id)
        old_repo = Repo.find_by_github_id(github_id)
        old_repo && old_repo.delete && old_repo.id
      end
    end
  end
end
