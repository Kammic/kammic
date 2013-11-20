json.loading       @loading_repos
json.repos do 
  json.array! @repos do |repo|
    json.id          repo.id
    json.name        repo.name
    json.full_name   repo.full_name
    json.description repo.description
    json.short_description repo.short_description
    json.private     repo.private
    json.follow_url  follow_url(repo)
    json.following   repo.book ? true : false
    json.book        repo.book
  end
end
