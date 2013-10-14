class CreateRepos < ActiveRecord::Migration
  def up
    create_table :repos do |t|
      t.string  :name
      t.string  :full_name
      t.string  :description
      t.boolean :private
      t.string  :clone_url
      t.string  :master_branch
      t.string  :pushed_at
      t.integer :user_id
      t.timestamps
    end
  end

  def down
    drop_table :repos
  end
end
