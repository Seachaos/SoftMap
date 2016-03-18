class ApiController < ApplicationController
	before_filter :require_login

	def new_task
		task = TaskLink.find_by_id(params[:task_id])
		if task.present? then
			task.update(TaskLink.fromParams(params))
		else
			task = TaskLink.new(TaskLink.fromParams(params))
		end
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

	def save_position
		task = TaskLink.find_by_id(params[:task_id])
		unless task.present? then
			render :json=>{
				:status => 1,
				:emsg => "Can't set position"
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
		tasks = TaskLink.where('previous_id = ?', params[:previous_id])
		render :json=>{
			:status => 0,
			:tasks => tasks
		}
	end
end
