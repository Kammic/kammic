json.array! @books do |book|
  json.name book.manifest.title || book.repo.name
  json.description book.repo.description

  json.url          book_url(book)
  json.unfollow_url book_url(book)
  json.editor_url   repo_editor_url(book.repo.name)
end
