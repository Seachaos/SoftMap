class CreateTaskLinks < ActiveRecord::Migration
  def change
    create_table :task_links do |t|
      t.integer :next_id
      t.integer :previous_id
      t.string :name
      t.string :state_str
      t.integer :state_int
      t.integer :user_id
      t.integer :assignee_user_id

      t.timestamps null: false
    end
  end
end
