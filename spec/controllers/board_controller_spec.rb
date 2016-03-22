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
	let(:board_private){
		board = Board.new
		board.name = 'THIS IS PRIVATE_TEST'
		board.public_state = 0
		board.save
		board
	}

	describe "Boards verify." do
		render_views

		before(:each){
			expect(board_public.public_state).to be == 2
			expect(board_private.public_state).to be == 0
		}

		context "without login" do
			it "should only has public" do
				get :index
				expect(response.content_type).to eq("text/html")
				expect(response.body).to include(board_public.name)
				expect(response.body).not_to include 'Private Boards'
			end

			it "can't see private" do
				get :index
				expect(response.content_type).to eq("text/html")
				expect(response.body).not_to include(board_private.name)
			end
		end

		context "has user" do
			before(:each){
				session[:isLogin] = true
				session[:user_id] = user.id
			}

			it "should only has public" do
				get :index
				expect(response.content_type).to eq("text/html")
				expect(response.body).to include(board_public.name)
				expect(response.body).to include 'Logout'
			end

			it "can't see private" do
				get :index
				expect(response.content_type).to eq("text/html")
				expect(response.body).not_to include(board_private.name)
			end

			context "with board permission " do
				before(:each){
					permission = BoardPermission.new
					permission.board_id = board_private.id
					permission.user_id = user.id
					permission.permission = 'Creator'
					permission.save
				}

				it "can see private" do
					get :index
					expect(response.content_type).to eq("text/html")
					expect(response.body).to include(board_private.name)
				end
			end
			
		end
	end
end
