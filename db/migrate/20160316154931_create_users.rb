class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, :default=>'No Name'
      t.string :account
      t.string :password
      t.string :permission, :default=>'user'
      t.string :token
      t.string :mail
      t.string :challenge

      t.timestamps null: false
    end

    # add default admin
    user = User.new
    user.account = 'admin'
    user.permission = 'admin'
    user.challenge = User.createUUID
    user.password = User.sha256('admin' + user.challenge)
    user.name = 'admin'
    user.save
  end
end
