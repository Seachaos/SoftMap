class CreateBoardPermissions < ActiveRecord::Migration
  def change
    create_table :board_permissions do |t|
      t.integer :board_id
      t.integer :user_id
      t.integer :permission

      t.timestamps null: false
    end
  end
end
