require 'rails_helper'

RSpec.describe SystemSetting, type: :model do

  describe "States" do

	it "should has one name" do
		SystemSetting.setSetting('register_public', 'open')
		SystemSetting.setSetting('register_public', 'open')
		SystemSetting.setSetting('register_public', 'clsoe')
		expect(SystemSetting.where('name=?', 'register_public').length).to be == 1
	end

  	it "isRegisterPublic" do
  		SystemSetting.setSetting('register_public', 'open')
  		expect(SystemSetting.isRegisterPublic).to be true
  		SystemSetting.setSetting('register_public', 'close')
  		expect(SystemSetting.isRegisterPublic).to be false
  	end
  	
  end
end