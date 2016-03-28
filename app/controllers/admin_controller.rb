class AdminController < ApplicationController
	before_filter :require_admin

	def index
		redirect_to :action=>:system_setting
	end

	def system_setting
		if has_admin_key then
			return if _save_register_public
		end
		@isRegisterPublic = SystemSetting.isRegisterPublic
		session[:admin_key] = User.createUUID()
	end

protected
	def _save_register_public
		if params[:register_state].present? then
			value = params[:register_state]
			case value
				when 'close','open'
					SystemSetting.setSetting('register_public', value)
					flash[:message] = 'Set register state success'
				else
					flash[:err] = 'Set register state failed: option error (' + value + ')'
			end
			redirect_to :controller=>:admin, :action=>:system_setting, :t=>Time.now.to_i
			return true
		end
		return false
	end
	def has_admin_key
		return false unless session[:admin_key].present?
		return true if session[:admin_key]==params[:admin_key]
		return false
	end

end
