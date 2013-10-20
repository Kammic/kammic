class AddLoadingBookManifest < ActiveRecord::Migration
  def up
    add_column :books, :loading_manifest, :boolean, default:false
  end

  def down
    remove_column :books, :loading_manifest
  end
end
