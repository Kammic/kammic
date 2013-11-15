json.array! @books do |book|
  json.id   book.id
  json.name (book.manifest && book.manifest.title) || book.repo.name
  json.description book.repo.description

  json.url          book_url(book)
  json.unfollow_url book_url(book)
  json.editor_url   repo_editor_url(book.repo.name)

  json.active_builds       book.active_builds
end
