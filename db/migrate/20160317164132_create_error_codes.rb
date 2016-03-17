class CreateErrorCodes < ActiveRecord::Migration
  def change
    create_table :error_codes do |t|

      t.timestamps null: false
    end
  end
end
