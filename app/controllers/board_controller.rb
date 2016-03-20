class BoardController < ApplicationController
	before_filter :require_login, :except=>[:index, :view]

	def index
		@public_boards = Board.getPublicBoards
	end

	def create
		@board = Board.new
	end

	def view
		@board = Board.find_by_id(params[:id])
		unless @board.present? then
			redirect_to :action=>:index
			return
		end
		# TODO check permission (visiable)


	end

	def save
		# TODO check permission
		if params[:board_id].present? then
			@board = Board.find_by_id(params[:board_id])
			@board.update(boardFromParams(params)) unless @board.presnet?
		end
		unless @board.present?
			@board = Board.new(boardFromParams(params))
		end
		@board.save
		flash[:msg] = 'Board save success'
		redirect_to :action=>:index
	end

	def boardFromParams(params)
		params.require(:board).permit(:name, :public_state)
	end
end
