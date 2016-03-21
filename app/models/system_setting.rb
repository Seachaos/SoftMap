class SystemSetting < ActiveRecord::Base

	def self.isRegisterPublic
		setting = SystemSetting.where('name=?','register_public').first
		return false unless setting.present?
		return true if setting.value == 'open'
		return false
	end

	def self.setSetting(name, value)
		setting = SystemSetting.where('name=?', name).limit(1).first
		setting = SystemSetting.new unless setting.present?
		setting.name = name
		setting.value = value
		setting.save
	end
end
