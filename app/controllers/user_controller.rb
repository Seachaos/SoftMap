class UserController < ApplicationController
	def login
		@user = User.new
		if params[:user] then
			puser = params[:user]
			# check user login
			user = User.where('account=?', puser[:account]).first
			unless user.present? then
				flash[:login_msg] = 'Account not found'
				return false
			end
			unless user.password == puser[:password] then
				flash[:login_msg] = 'Password error'
				return false
			end

			reset_session
			# when login success
			session[:isLogin] = true
			session[:user_id] = user.id
			redirect_to :controller=>'home'
			return true
		end
	end

	def logout
		reset_session
		flash[:login_msg] = 'Logout success'
		redirect_to :controller=>'user', :action=>'login'
		return true
	end
end
