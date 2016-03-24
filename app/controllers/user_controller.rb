class UserController < ApplicationController

	def get_challenge
		account = params[:account]
		user = User.where('account=?', account).first
		hash = User.createUUID
		if user.present? then
			hash = user.challenge
		else
			account = 'none' unless account.present?
			hash = User.sha256(account)
		end

		key = User.createUUID
		session[:login_key] = key
		render :json =>{
			'status' => 0,
			'hash' => hash,
			'key' => key
		}
	end
	def login
		@user = User.new
		if params[:user] then
			unless session[:login_key].present? then
				flash[:login_msg] = 'Session error'
				return false
			end
			puser = params[:user]
			# check user login
			user = User.where('account=?', puser[:account]).first
			unless user.present? then
				flash[:login_msg] = 'Account not found'
				return false
			end
			input_pwd = puser[:password]
			unless User.sha256(user.password + session[:login_key]) === input_pwd then
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
		@user.challenge = User.createUUID
    	@user.password = User.sha256(@user.password + @user.challenge)
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
