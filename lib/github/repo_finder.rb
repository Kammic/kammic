module Github
  class RepoFinder
    def self.find_repos(auth_token)
      client = Octokit::Client.new(access_token: auth_token)
      keys   = Repo.new.attributes.keys
      client.repos.map do |repo|
        Kammic::HashCleaner.clean(repo.attrs, keys).tap do |hash|
          hash[:clone_url] = repo.rels[:git].href
          hash[:html_url]  = repo.rels[:html].href
        end
      end
    rescue Octokit::Unauthorized
      []
    end
  end
end
