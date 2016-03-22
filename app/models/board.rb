class Board < ActiveRecord::Base
	# 0 : private, 1 : protected, 2 : public
	validates_inclusion_of :public_state, :in => [
		0, 1, 2
	]

	def self.getBoardPublisStateDict
		{
			0 => 'Private',
			1 => 'Protected',
			2 => 'Public'
		}
	end

	def self.getBoardPublisStateVisiableDict
		{
			0 => 'Only Invited',
			1 => 'Only Users',
			2 => 'EveryOne'
		}
	end

	def self.getPublicBoards
		return Board.where('public_state=?', 2)
	end

	def self.getOwnBoards(user)
		permissions = BoardPermission.where('user_id=?', user.id)
		array = []
		permissions.each do |permission|
			array.push permission.board_id
		end
		Board.where( :id => array )
	end

	def isPrivate
		return self.public_state == 0
	end

	def permissionForView(user)
		return true if self.public_state === 2
		checkPermissionExists user, 'Creator'
	end

	def permissionForEdit(user)
		if user.present? then
			return true if self.public_state === 2
		end
		checkPermissionExists user, 'Creator'
	end

	def permissionForInvitedPeople(user)
		return false unless self.public_state == 0
		checkPermissionExists user, 'Creator'
	end
protected
	
	def checkPermissionExists(user, name)
		return false unless user.present?

		permission = BoardPermission.where('board_id=? and user_id=?', self.id, user.id).first
		return false unless permission.present?
		return true if permission.permission.include? name
		return false
	end
end
