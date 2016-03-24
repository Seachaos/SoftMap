class TaskLink < ActiveRecord::Base

	def self.fromParams(params)
		params.require(:task).permit(:name,
			:description, :previous_id, :assignee_user_id, :state_int ) 
	end
end
