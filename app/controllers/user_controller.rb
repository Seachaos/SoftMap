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

	def register
		unless SystemSetting.isRegisterPublic then
			redirect_to :controller=>'user', :action=>'login'
			return
		end
		@user = User.new
	end

	def create
		unless SystemSetting.isRegisterPublic then
			redirect_to :controller=>'user', :action=>'login'
			return
		end
		@user = User.new(userCreateFromParams(params))
		if @user.save then
			flash[:msg] = 'Register Success'
			redirect_to :controller=>'home', :action=>'index'
		else
			flash[:error] = 'Register failed'
			render :action=>'register'
		end
	end

protected
	def userCreateFromParams(params)
		params.require(:user).permit(:name, :account, :password, :mail)
	end
end
