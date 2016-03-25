require 'rails_helper'

def create_system_task (name)
  	state = TaskState.new
  	state.name = name
  	state.board_id = 0
  	state.save
end

RSpec.describe TaskState, type: :model do
  describe "With board" do
  	let(:board_public){
		board = Board.new
		board.name = 'THIS IS PUBLIC_TEST'
		board.public_state = 2
		board.save
		board
	}
	let(:board_private){
		board = Board.new
		board.name = 'THIS IS PRIVATE_TEST'
		board.public_state = 0
		board.save
		board
	}

  	before(:each) do
  		create_system_task('S1')
  		create_system_task('S2')
  		create_system_task('S3')
  	end

  	context "without custome." do
  		it "count correct" do
  			state_pri = TaskState.getStateJsonByBoardId(board_private.id)
  			state_pub = TaskState.getStateJsonByBoardId(board_public.id)
  			expect(state_pri.length).to be == state_pub.length
  			expect(state_pri.length).to be == 4
  		end
  	end

  	context "has custome." do
  		before(:each) do
  			# insert to private
  			expect(TaskState.insertState(board_private.id, 'P1')).not_to be false
  			expect(TaskState.insertState(board_private.id, 'P2')).not_to be false
  			expect(TaskState.insertState(board_private.id, 'P3')).not_to be false
  		end

  		it "count correct" do
  			state_pri = TaskState.getStateJsonByBoardId(board_private.id)
  			state_pub = TaskState.getStateJsonByBoardId(board_public.id)
  			expect(state_pri.length).not_to be == state_pub.length
  			expect(state_pri.length).to be == 7
  			names = state_pri.map{|key, value| value}
  			expect(names).to include 'P3'
  			expect(names).to include 'S3'
  		end

  	end
  end
end
