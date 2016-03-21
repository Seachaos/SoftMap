class HomeController < ApplicationController
	before_filter :require_login, :except=>'index'

	def index
		
	end

end
