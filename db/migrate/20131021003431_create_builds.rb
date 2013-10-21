class CreateBuilds < ActiveRecord::Migration
  def up
    create_table :builds do |t|
      t.string   :status
      t.string   :branch
      t.string   :commit_message
      t.string   :author
      t.string   :revision
      t.datetime :started_at
      t.datetime :ended_at
      t.hstore   :assets
      t.integer  :book_id
      t.timestamps
    end
  end

  def down
    drop_Table :builds
  end
end
