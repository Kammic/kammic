json.total_pages   @builds.total_pages
json.builds do
  json.array! @builds do |build|
    json.partial! 'builds/build', build: build
  end
end
