class BoardPermission < ActiveRecord::Base

	def self.permissionList
		['None', 'Creator', 'Viewer', 'Editor']
	end

	def self.getUsersByBoardId(board_id)
		user_ids = []
		permissions = {}
		BoardPermission.where('board_id=?', board_id).each do |permission|
			permissions[permission.user_id] = permission
			user_ids.push(permission.user_id)
		end

		return User.where({:id => user_ids } ).map{ |user|
			user.board_permission = permissions[user.id].permission
			user
		}
	end

	def self.setBoardPermission(user_id, board_id, text)
		return false unless BoardPermission.permissionList.include? text
		permission = BoardPermission.where('board_id=? and user_id=?', board_id, user_id).first
		permission = BoardPermission.new unless permission.present?
		if text == 'None'
			permission.delete
			return true
		end
		permission.board_id = board_id
		permission.user_id = user_id
		permission.permission = text
		permission.save
	end

	def self.checkBoardPermissionChangeWillHasError(user_id, board, text)
		permission = BoardPermission.where('board_id=? and user_id=?', board.id, user_id).first
		return false unless permission.present?
		if permission.permission == 'Creator' then
			permissions = BoardPermission.where('board_id=? and permission=?', board.id, 'Creator')
			return "If only one Creator, You can't change it" if permissions.size == 1
		end
		return false
	end
end
