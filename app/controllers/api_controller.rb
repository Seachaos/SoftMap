class ApiController < ApplicationController
	before_filter :require_login, :except=>[:get_task]

	def new_task
		return unless verify_board_permission
		task = TaskLink.find_by_id(params[:task_id])
		if task.present? then
			task.update(TaskLink.fromParams(params))
		else
			task = TaskLink.new(TaskLink.fromParams(params))
		end

		# verify user
		if task.assignee_user_id==0 then # if is me
			task.assignee_user_id = @user.id
		end
		unless User.find_by_id(task.assignee_user_id).present? then
			render :json=>{
				:status => 1,
				:emsg => "User not exists."
			}
			return
		end

		# save else data
		task.board_id = params[:board_id]
		task.user_id = @user.id
		unless task.save then
			render :json=>{
				:status => 1,
				:emsg => "Can't save task"
			}
			return
		end
		render :json=>{
			:status => 0
		}
	end

	def save_position
		# TODO check permission
		# using secure code (change_code) ?
		task = TaskLink.find_by_id(params[:task_id])
		unless task.present? then
			render :json=>{
				:status => 1,
				:emsg => "Can't set position"
			}
			return
		end
		board = Board.find_by_id(task.board_id)
		unless board.permissionForEdit(@user) then
			render :json=>{
				:status => 1,
				:emsg => "Access deny"
			}
			return
		end


		task.x = params[:x].to_i
		task.y = params[:y].to_i
		unless task.save then
			render :json=>{
				:status => 1,
				:emsg => "Can't save task"
			}
		end
		render :json=>{
			:status => 0
		}
	end

	def get_task
		return unless verify_board_permission
		tasks = TaskLink.where('previous_id = ? and board_id = ?', params[:previous_id], params[:board_id])
		render :json=>{
			:status => 0,
			:tasks => tasks
		}
	end

protected
	def verify_board_permission
		@board = Board.find_by_id(params[:board_id])
		unless @board.present? then
			render :json=>{
				:status => 1,
				:emsg => "Board error"
			}
			return false
		end
		unless @board.permissionForView(@user) then
			render :json=>{
				:status => 1,
				:emsg => "Access deny"
			}
			return false
		end
		return true
	end
end
