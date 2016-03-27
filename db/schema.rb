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

ActiveRecord::Schema.define(version: 20160324162154) do

  create_table "board_permissions", force: :cascade do |t|
    t.integer  "board_id"
    t.integer  "user_id"
    t.string   "permission"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "boards", force: :cascade do |t|
    t.string   "name"
    t.integer  "public_state", default: 0
    t.integer  "creator_id",   default: 0
    t.string   "description"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "boards", ["creator_id"], name: "index_boards_on_creator_id"
  add_index "boards", ["public_state"], name: "index_boards_on_public_state"

  create_table "error_codes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "system_settings", force: :cascade do |t|
    t.string   "name"
    t.string   "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "system_settings", ["name"], name: "index_system_settings_on_name"

  create_table "task_links", force: :cascade do |t|
    t.integer  "board_id",         default: 10
    t.integer  "next_id",          default: 0
    t.integer  "previous_id",      default: 0
    t.integer  "x",                default: 190
    t.integer  "y",                default: 60
    t.integer  "width",            default: 150
    t.integer  "height",           default: 100
    t.string   "name"
    t.string   "description"
    t.string   "change_code"
    t.integer  "state_int",        default: 0
    t.integer  "user_id"
    t.integer  "assignee_user_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  add_index "task_links", ["assignee_user_id"], name: "index_task_links_on_assignee_user_id"
  add_index "task_links", ["board_id"], name: "index_task_links_on_board_id"
  add_index "task_links", ["next_id"], name: "index_task_links_on_next_id"
  add_index "task_links", ["previous_id"], name: "index_task_links_on_previous_id"
  add_index "task_links", ["state_int"], name: "index_task_links_on_state_int"
  add_index "task_links", ["user_id"], name: "index_task_links_on_user_id"

  create_table "task_states", force: :cascade do |t|
    t.string   "name"
    t.integer  "board_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",       default: "No Name"
    t.string   "account"
    t.string   "password"
    t.string   "permission", default: "user"
    t.string   "token"
    t.string   "mail"
    t.string   "challenge"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

end
