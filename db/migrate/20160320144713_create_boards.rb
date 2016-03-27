class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
      t.string :name
      t.integer :public_state, :default=>0, :index=>true
      t.integer :creator_id, :default=>0, :index=>true
      t.string :description

      t.timestamps null: false
    end

    board = Board.new
    board.public_state = 2
    board.name = 'Public DEMO'
    board.save

    board = Board.new
    board.public_state = 1
    board.name = 'Protected DEMO'
    board.save
  end
end
