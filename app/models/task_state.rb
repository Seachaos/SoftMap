class TaskState < ActiveRecord::Base
	def self.getStateByBoardId(board_id)
		return TaskState.where('board_id = 0 or board_id =?', board_id)
	end

	def self.getStateJsonByBoardId(board_id)
		resp = { '0' => 'None' }
		TaskState.getStateByBoardId(board_id).each do |state|
			resp[state.id] = state.name
		end
		return resp
	end

	def self.insertState(board_id, name)
		state = TaskState.new
		state.board_id = board_id
		state.name = name
		return false unless state.save
		return state.id
	end

end
