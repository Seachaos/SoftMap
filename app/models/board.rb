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
		return Board.where('public_state', 2)
	end
end
