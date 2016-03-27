class User < ActiveRecord::Base
	attr_accessor :board_permission

	def self.createUUID()
		return User.sha256(SecureRandom.urlsafe_base64 + SecureRandom.urlsafe_base64)
	end

	def self.sha256(value)
		sha256 = Digest::SHA256.new
		resp = sha256.hexdigest value
		resp.to_s
	end

end
