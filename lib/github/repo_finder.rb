module Github
  class RepoFinder
    def self.find_repos(auth_token)
      client = Octokit::Client.new(access_token: auth_token)
      client.repos.map do |repo|
        Kammic::HashCleaner.clean(repo.attrs, Repo.new.attributes.keys)
      end
    rescue Octokit::Unauthorized
      []
    end
  end
end
