class TaskLink < ActiveRecord::Base

	def self.fromParams(params)
		params.require(:task).permit(:name,
			:description) 
	end
end
