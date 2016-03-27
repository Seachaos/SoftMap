class BoardController < ApplicationController
	before_filter :require_login, :except=>[:index, :view]

	def index
		@public_boards = Board.getPublicBoards
		@own_boards = false
		if @isLogin then
			@own_boards = Board.getOwnBoards @user
		end
	end

	def create
		@board = Board.new
	end

	def view
		return unless has_board_select
		return unless check_pass @board.permissionForView(@user), 'Access deny'
		
		@states = TaskState.getStateJsonByBoardId(@board.id)

		@users = false # list user for selector
		@view_only = false
		@view_only = true if params[:mode] == 'view_only'
		
		@permissionEdit = false
		@canEdit = false # control edit mode

		if @board.permissionForEdit(@user) then
			@users = {}
			@users[0] = 'Me'
			BoardPermission.getUsersByBoardId(@board.id).each do |user|
				@users[user.id] = user.name
			end

			@permissionEdit = true
			@canEdit = true unless @view_only
			@permissionSetting = @board.permissionForSetting(@user)
		end

	end

	def save
		# TODO check permission
		if params[:board_id].present? then
			@board = Board.find_by_id(params[:board_id])
			@board.update(boardFromParams(params)) unless @board.presnet?
		end
		unless @board.present?
			@board = Board.new(boardFromParams(params))
			@board.creator_id = @user.id
		end
		@board.save

		# set permission
		BoardPermission.setBoardPermission @user.id, @board.id, 'Creator'

		flash[:msg] = 'Board save success'
		redirect_to :action=>:index
	end

	def setting
		return unless has_board_select
		return unless check_pass @board.permissionForSetting(@user), 'Access deny'

		if params[:post_action]=='save' then
			error = BoardPermission.checkBoardPermissionChangeWillHasError(params[:user_id], @board, params[:permission])
			unless error then
				if BoardPermission.setBoardPermission(params[:user_id], @board.id, params[:permission]) then
					flash[:msg] = 'Set Permission success'
				else
					flash[:error] = 'Set Permission Failed'
				end
				redirect_to :id=>@board.id
				return
			else
				flash[:error] = error
				redirect_to :id=>@board.id
				return
			end
		end

		exists_user = {}
		@users = BoardPermission.getUsersByBoardId(@board.id).map{ |user|
			exists_user[user.id] = true
			{
				:id=>user.id, :name=>user.name, :board_permission => user.board_permission
			}
		}
		@allUsers = User.all.map{ |user|
			{
				:id=>user.id, :name=>user.name
			}
		}.select{ |user| 
			!(exists_user.include? user[:id])
		}
	end

protected

	def has_board_select()
		@board = Board.find_by_id(params[:id])
		unless @board.present? then
			redirect_to :action=>:index
			return false
		end
		return true
	end

	def check_pass(value, message = nil)
		unless value then
			flash[:error] = message
			redirect_to :action=>:index
			return false
		end
		return true
	end

	def boardFromParams(params)
		params.require(:board).permit(:name, :public_state)
	end
end
