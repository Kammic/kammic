class BuildStatus < ActiveRecord::Migration
  def up
    add_column :builds, :deletions, :integer, default: 0
    add_column :builds, :additions, :integer, default: 0
  end

  def down
    remove_column :builds, :deletions, :integer
    remove_column :builds, :additions, :integer
  end


end
