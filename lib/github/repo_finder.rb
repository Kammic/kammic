module Github
  class RepoFinder
    def self.find_repos(auth_token)
      client = Octokit::Client.new(access_token: auth_token)
      client.repos.map { |repo| clean_hash(repo.attrs) }
    rescue Octokit::Unauthorized
      []
    end

    def self.clean_hash(hash)
      hash         = hash.with_indifferent_access
      clean_hash   = {}.with_indifferent_access
      allowed_keys = Repo.new.attributes.keys
      allowed_keys.each do |key|
        clean_hash[key] = hash[key]
      end
      clean_hash
    end
  end
end
