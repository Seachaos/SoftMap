class CreateTaskStates < ActiveRecord::Migration

  def create_system_task (name)
  	state = TaskState.new
  	state.name = name
  	state.board_id = 0
  	state.save
  end
  def change
    create_table :task_states do |t|
      t.string :name
      t.integer :board_id

      t.timestamps null: false
    end

    create_system_task ('Todo')
    create_system_task ('Doing')
    create_system_task ('Done')
    create_system_task ('Test')
    create_system_task ('Close')
  end
end
