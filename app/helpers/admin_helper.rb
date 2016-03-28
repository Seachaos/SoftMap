module AdminHelper

	def is_select (value)
		return 'selected="selected"' if value
		return ''
	end

	def is_select_unless(value)
		return 'selected="selected"' unless value
		return ''
	end

	def render_admin_key()
		key = session[:admin_key]
		html = '<input type="hidden" name="admin_key" value="' + key + '" />'
		return html.html_safe
	end
end
