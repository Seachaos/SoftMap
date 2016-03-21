class CreateSystemSettings < ActiveRecord::Migration
  
  def change
    create_table :system_settings do |t|
      t.string :name, :index=>true
      t.string :value

      t.timestamps null: false
    end

    SystemSetting.setSetting('register_public', 'open')
  end
end
