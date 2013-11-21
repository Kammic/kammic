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
          create_or_update_from_hash github_repo, user_id
        end

        user.is_loading_repos(false)
      end

      private
      def create_or_update_from_hash(hash, user_id)
        github_id = hash["id"]
        hash.delete("id")

        repo = Repo.find_by_github_id(github_id) || Repo.new(hash)
        repo.update_attributes(hash)

        repo.user_id = user_id
        repo.github_id = github_id
        repo.save
      end

      def delete_user_repos(user_id)
        repos = Repo.where(user_id: user_id)
        repos.each {|r| r.destroy }
      end
    end
  end
end
