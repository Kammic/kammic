class AddBookmodel < ActiveRecord::Migration
  def up
    create_table :books do |t|
      t.integer :repo_id
      t.integer :user_id
      t.string :cover_image_url
      t.timestamps
    end
  end

  def down
    drop_table :books
  end
end
