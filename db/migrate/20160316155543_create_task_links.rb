class CreateTaskLinks < ActiveRecord::Migration
  def change
    create_table :task_links do |t|
      t.integer :board_id, :default=>0, :index=>true
      t.integer :next_id, :default=>0, :index=>true
      t.integer :previous_id, :default=>0, :index=>true
      t.integer :x, :default=>190
      t.integer :y, :default=>60
      t.integer :width, :default=>150
      t.integer :height, :default=>100
      t.integer :board_id, :default=>10, :index=>true
      t.string :name
      t.string :description
      t.string :state_str
      t.string :change_code
      t.integer :state_int, :index=>true
      t.integer :user_id, :index=>true
      t.integer :assignee_user_id, :index=>true

      t.timestamps null: false
    end
  end
end
