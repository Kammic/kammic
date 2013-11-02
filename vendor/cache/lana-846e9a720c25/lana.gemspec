# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "lana"
  s.version = "1.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6") if s.respond_to? :required_rubygems_version=
  s.authors = ["Sumeet Singh"]
  s.date = "2013-11-02"
  s.description = "Generate a book from a git repo"
  s.email = "ortuna@gmail.com"
  s.files = [".gitignore", ".rspec", "Gemfile", "README.md", "Rakefile", "lana.gemspec", "lib/lana.rb", "lib/lana/book_generator.rb", "lib/lana/compiler.rb", "lib/lana/manifest.rb", "lib/lana/version.rb", "spec/fixtures/example_book/chapters/chapter1.md", "spec/fixtures/example_book/chapters/chapter2.md", "spec/fixtures/example_book/invalid.json", "spec/fixtures/example_book/manifest.json", "spec/fixtures/example_book/simple.json", "spec/lana/.rspec", "spec/lana/book_generator_spec.rb", "spec/lana/compiler_spec.rb", "spec/lana/manifest_spec.rb", "spec/spec_helper.rb", "lib/lana"]
  s.homepage = "http://www.padrinorb.com"
  s.rdoc_options = ["--charset=UTF-8"]
  s.require_paths = ["lib"]
  s.rubygems_version = "2.0.6"
  s.summary = "Genearte a book give a git repo"
  s.test_files = ["spec/fixtures/example_book/chapters/chapter1.md", "spec/fixtures/example_book/chapters/chapter2.md", "spec/fixtures/example_book/invalid.json", "spec/fixtures/example_book/manifest.json", "spec/fixtures/example_book/simple.json", "spec/lana/.rspec", "spec/lana/book_generator_spec.rb", "spec/lana/compiler_spec.rb", "spec/lana/manifest_spec.rb", "spec/spec_helper.rb"]

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<pandoc-ruby>, ["~> 0.7"])
      s.add_runtime_dependency(%q<grit>, [">= 0"])
      s.add_development_dependency(%q<rake>, ["~> 10.1"])
      s.add_development_dependency(%q<rspec>, ["~> 2.14"])
      s.add_development_dependency(%q<pry>, [">= 0"])
    else
      s.add_dependency(%q<pandoc-ruby>, ["~> 0.7"])
      s.add_dependency(%q<grit>, [">= 0"])
      s.add_dependency(%q<rake>, ["~> 10.1"])
      s.add_dependency(%q<rspec>, ["~> 2.14"])
      s.add_dependency(%q<pry>, [">= 0"])
    end
  else
    s.add_dependency(%q<pandoc-ruby>, ["~> 0.7"])
    s.add_dependency(%q<grit>, [">= 0"])
    s.add_dependency(%q<rake>, ["~> 10.1"])
    s.add_dependency(%q<rspec>, ["~> 2.14"])
    s.add_dependency(%q<pry>, [">= 0"])
  end
end
