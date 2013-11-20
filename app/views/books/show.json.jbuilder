json.loading     @book.loading_manifest
if @book.manifest
  json.title       @book.manifest.title
  json.cover_image @book.manifest.cover_image
  json.pages       @book.manifest.pages
end
