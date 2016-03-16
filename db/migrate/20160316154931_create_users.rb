class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :account
      t.string :password
      t.string :permission

      t.timestamps null: false
    end

    # add default admin
    user = User.new
    user.account = 'admin'
    user.password = 'admin'
    user.permission = 'admin'
    user.save
  end
end
