class Lastcommithref < ActiveRecord::Migration
  def up
    add_column :builds, :github_commit_url, :string
  end

  def down
    remove_column  :builds, :github_commit_url, :string
  end
end
