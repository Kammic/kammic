module Github
  class RepoQueue
    class << self
      def update_from_github(user_id)
        user = User.find_by_id(user_id)
        return false unless user && user.auth_token

        github_repos = Github::RepoFinder.find_repos(user.auth_token)
        github_repos.each do |github_repo|
          create_from_hash github_repo, user_id
        end
      end

      private
      def create_from_hash(hash, user_id)
        repo = Repo.new(hash)
        repo.user_id = user_id
        delete_if_exists repo[:id]
        repo.save
      end

      def delete_if_exists(repo_id)
        old_repo = Repo.find_by_id(repo_id)
        old_repo && old_repo.delete
      end
    end
  end
end
