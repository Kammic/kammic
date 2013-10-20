class CreateManifests < ActiveRecord::Migration
  def up
    enable_extension "hstore"
    create_table :manifests do |t|
      t.string  :title
      t.string  :cover_image
      t.text    :pages
      t.integer :book_id
      t.timestamps
    end
  end

  def down
    disable_extension "hstore"
    drop_table :manifests
  end
end
