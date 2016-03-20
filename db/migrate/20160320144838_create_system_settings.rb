class CreateSystemSettings < ActiveRecord::Migration
  def change
    create_table :system_settings do |t|
      t.string :name
      t.string :value

      t.timestamps null: false
    end
  end
end
