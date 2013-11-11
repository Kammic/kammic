# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131111033648) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "books", force: true do |t|
    t.integer  "repo_id"
    t.integer  "user_id"
    t.string   "cover_image_url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "loading_manifest", default: false
  end

  create_table "builds", force: true do |t|
    t.string   "status",         default: "complete"
    t.string   "branch"
    t.string   "commit_message"
    t.string   "author"
    t.string   "revision"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.hstore   "assets"
    t.integer  "book_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "manifests", force: true do |t|
    t.string   "title"
    t.string   "cover_image"
    t.text     "pages"
    t.integer  "book_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "queue_classic_jobs", force: true do |t|
    t.text     "q_name",    null: false
    t.text     "method",    null: false
    t.json     "args",      null: false
    t.datetime "locked_at"
  end

  add_index "queue_classic_jobs", ["q_name", "id"], name: "idx_qc_on_name_only_unlocked", where: "(locked_at IS NULL)", using: :btree

  create_table "repos", force: true do |t|
    t.string   "name"
    t.string   "full_name"
    t.text     "description"
    t.boolean  "private"
    t.string   "clone_url"
    t.string   "master_branch"
    t.datetime "pushed_at"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "html_url"
    t.integer  "github_id"
  end

  create_table "users", force: true do |t|
    t.string   "uid"
    t.string   "provider"
    t.string   "name"
    t.string   "auth_token"
    t.string   "image_url"
    t.string   "role"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "login"
    t.boolean  "loading_repos", default: false
  end

end
