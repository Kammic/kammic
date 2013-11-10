json.array! @repos do |repo|
  json.name        repo.name
  json.full_name   repo.full_name
  json.description repo.description
  json.private     repo.private
  json.follow_url  follow_url(repo)
end
