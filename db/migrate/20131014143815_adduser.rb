class Adduser < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.string :uid
      t.string :provider
      t.string :name
      t.string :auth_token
      t.string :image_url
      t.string :role
      t.timestamps
    end
  end

  def down
    drop_table :users
  end
end
