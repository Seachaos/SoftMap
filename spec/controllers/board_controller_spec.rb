require 'rails_helper'

RSpec.describe BoardController, type: :controller do

	let(:user){
		user = User.new
		user.save
		user
	}
	let(:board_public){
		board = Board.new
		board.name = 'THIS IS PUBLIC_TEST'
		board.public_state = 2
		board.save
		board
	}

	describe "Boards verify." do
		render_views
		before(:each){
			expect(board_public.public_state).to be == 2
		}
		context "without login" do
			it "should only has public" do
				get :index
				expect(response.content_type).to eq("text/html")
				expect(response.body).to include(board_public.name)
			end
		end
		context "has user" do
		end
	end
end
