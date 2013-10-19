class AddLoadingRepo < ActiveRecord::Migration
  def up
    add_column :users, :loading_repos, :boolean
  end

  def down
    remove_column :users, :loading_repos
  end
end
