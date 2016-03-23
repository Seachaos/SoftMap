var min_box_width = 150;
var min_box_height = 100;

var TaskLinkBox = React.createClass({
	getInitialState : function(){
		return {
			x : this.props.x || 10,
			y : this.props.y || 10,
			height : this.props.data.height || min_box_height,
			width : this.props.data.width || min_box_width,
			canEdit : this.props.canEdit || false,
			reload_sub_task : true,
			data : this.props.data,
			previousData : this.props.previousData || false
		}
	},
	loadTask : function(){
		apiCall(url_api_get_task,
		{
			previous_id : this.props.data.id,
			board_id : board_id
		}, function(resp){
			this.setState({
				reload_sub_task : false,
				sub_task_array : resp.tasks
			});
		}, this);
	},
	handleMouseMove : function(e){
		if(! this.inDragMode){
			return
		}
		var diffX = e.pageX - this.actionX;
		this.actionX = e.pageX;
		if(diffX!=0){
			var x = this.state.x + diffX;
			this.setState({ x : x})
		}
		var diffY = e.pageY - this.actionY;
		this.actionY = e.pageY;
		if(diffY!=0){
			var y = this.state.y + diffY;
			this.setState({ y : y})
		}
	},
	handleMouseDown : function(e){
		this.inDragMode = true;
		this.actionX = e.pageX;
		this.actionY = e.pageY;
	},
	handleMouseUp : function(e){
		this.inDragMode = false;
		panelHandleMouseMove = false;
		this.needSavePosition = true;
		this.setState({
			savePosition : true
		})
	},
	handleMouseOut : function(e){
		panelHandleMouseMove = this.handleMouseMove;
	},
	handleClickNewSubTask : function(e){
		var data = this.state.data;
		showNewTaskDialog({
			previous_id : data.id,
			previous_name : data.name,
			next_x : this.state.width + 50
		});
	},
	handleResize : function(width, height){
		this.setState({
			width: width,
			height : height
		});
	},
	savePosition : function(){
		this.needSavePosition = false;
		apiCall(url_api_save_position, {
			task_id : this.state.data.id,
			x : this.state.x,
			y : this.state.y
		});
	},
	saveSize : function(){
		this.needSaveSize = false;
		apiCall(url_api_save_position, {
			task_id : this.state.data.id,
			width : this.state.width,
			height : this.state.height
		});
	},
	createEditTags : function(){
		var data = this.state.data;
		var width = this.state.width;
		var height = this.state.height;
		var resp = [];

		var _x_add_tag = width - 28;
		// add tag
		resp.push(React.createElement('g',{
				className : 'svg_new_tag_g',
				onClick : this.handleClickNewSubTask,
				key: data.id+'_tag_add'
			},
			React.createElement('rect', {
				className : 'svg_add_tag',
	            width : 28,
	            height : 20,
				x: _x_add_tag,
				y:-20
			}),
			React.createElement('text', { x:_x_add_tag+10 , y: -5}, ' + ')
		));

		// move tag
		resp.push(React.createElement('g',{
				onMouseMove : this.handleMouseMove,
				onMouseDown : this.handleMouseDown,
				onMouseUp : this.handleMouseUp,
				onMouseOut : this.handleMouseOut,
				className : 'svg_move_tag_g',
				key: data.id+'_tag_move'
			},
			React.createElement('rect', {
				className : 'svg_move_tag',
				width : 36,
        		height : 20,
				y:-20
			}),
			React.createElement('image',{
				xlinkHref:url_icon_move,
				width : 36,
        		height : 16,
				y:-18
			})
		));

		// resize tag
		resp.push(React.createElement(TaskLinkBoxButtonResize, {
			data : data,
			width : width,
			height : height,
			resize : this.handleResize,
			sender : this,
			key: data.id+'_tag_resize'
		}));

		// edit tag
		resp.push(React.createElement(TaskLinkBoxButtonEdit,{
			data : data,
			width : width,
			height : height,
			key: data.id+'_tag_edit'
		}));
		return resp;
	},
	render: function(){
		var data = this.state.data;
		var height = this.state.height;
		var width = this.state.width;
		var text_padding = 10;
		var text_width = width - text_padding * 2;

		var transform = 'translate('+this.state.x+', ' + this.state.y + ')';
		taskDispatcher[data.id] = this;

		if(this.needSavePosition){
			this.savePosition();
		}
		if(this.needSaveSize){
			this.saveSize();
		}
		
		// prepare link line
		var link_line = null;
		if(this.state.previousData){ // if has previous data
			var previousData = this.state.previousData;
			link_line = React.createElement('line', {
				className : 'svg_link_line',
				x1 : previousData.width,
				y1 : previousData.height / 2,
				x2 : this.state.x,
				y2 : this.state.y + this.state.height / 2
			});
		}

		if(this.state.reload_sub_task){
			this.loadTask();
		}else{
			var canEdit = this.state.canEdit;
			var previousData = this.state.data;
			previousData.width = width;
			previousData.height = height;
			var task_array = this.state.sub_task_array.map(function(task){
				return React.createElement(TaskLinkBox, {
					data:task,
					x: task.x,
					y: task.y,
					canEdit : canEdit,
					key: 'task_link_id_' + task.id,
					previousData : previousData
				});
			});
		}

		var canEdit = this.props.canEdit;

		var tags = [];
		if(canEdit){
			tags = this.createEditTags();
		}

		// assignee user name
		var user_name = user_list[data.assignee_user_id];
		if(!user_name){ user_name = 'Unknow' }
		user_name = 'Assignee：\n' + user_name;
		if(user_name.length * 6 > (width - text_padding)){
			var len = (width - text_padding * 2) / 6
			user_name = user_name.substr(0, len - 2) + '...';
		}

		// return render
		var box =  React.createElement('g', {
				className : 'task_link_box',
				transform : transform,
				key : data.id + '_g_box_body'
			},
			task_array,
			// ---- content ----
			// background
			React.createElement('rect', {
				className : 'svg_task_box',
				width : width,
				height : height
			}),
			// id
			React.createElement('text', { x : text_padding, y : 16 }, '#'+data.id),
			// name
			React.createElement('text', { x : text_padding, y : 36 }, data.name),
			// description
			React.createElement('text', { x : text_padding, y : 56 }, data.description),
			// assignee_user
			React.createElement('text', { x : text_padding,
				y : height - text_padding,
				width : text_width,
				className : 'svg_text_assignee' }, user_name),
			// tags ---- 
			tags
			// ------ end ----
		);
		return React.createElement('g', {
				key : data.id + '_g_box'
			},
			link_line,
			box);
	}
});

var TaskLinkBoxButtonEdit = React.createClass({
	handleClick : function(){
		var data = this.props.data;
		showNewTaskDialog({
			task_id : data.id,
			previous_id : data.previous_id,
			data : data
		});
	},
	render : function(){
		var data = this.props.data;
		var width = 24;
		var height = 20;

		return React.createElement('g',{
				className : 'svg_edit_tag_g',
				key : data.id + '_g_edit_tag',
				onClick : this.handleClick
			},
			React.createElement('rect', {
				className : 'svg_edit_tag',
	            width : width,
	            height : height,
				x: 0,
				y: this.props.height
			}),
			React.createElement('image',{
				xlinkHref : url_icon_edit,
				x: 0,
				y: this.props.height + 2, 
				width : 24,
				height : 16
			})
		);
	}
})
var TaskLinkBoxButtonResize = React.createClass({
	handleMouseMove : function(e){
		if(! this.inDragMode){
			return
		}
		var width = this.props.width;
		var height = this.props.height;
		var diffX = e.pageX - this.actionX;
		this.actionX = e.pageX;
		if(diffX!=0){
			width += diffX;
		}
		var diffY = e.pageY - this.actionY;
		this.actionY = e.pageY;
		if(diffY!=0){
			height += diffY;
		}
		if(height<min_box_height){ height = min_box_height};
		if(width<min_box_width){ width = min_box_width};
		this.props.resize(width, height);
	},
	handleMouseDown : function(e){
		this.inDragMode = true;
		this.actionX = e.pageX;
		this.actionY = e.pageY;
	},
	handleMouseUp : function(e){
		this.inDragMode = false;
		panelHandleMouseMove = false;
		var sender = this.props.sender;
		sender.needSaveSize = true;
		sender.setState({
			saveSize : true
		})
		panelHandleMouseUp = false;
	},
	handleMouseOut : function(e){
		panelHandleMouseMove = this.handleMouseMove;
		panelHandleMouseUp = this.handleMouseUp;
	},
	render : function(){
		var data = this.props.data;
		var width = 24;
		var height = 20;
		return React.createElement('g', {
				className : 'svg_resize_tag_g',
				key : data.id + '_g_resize_tag',
				onMouseMove : this.handleMouseMove,
				onMouseDown : this.handleMouseDown,
				onMouseUp : this.handleMouseUp,
				onMouseOut : this.handleMouseOut
			},
			React.createElement('rect', {
				className : 'svg_resize_tag',
	            width : width,
	            height : height,
				x: this.props.width - width,
				y: this.props.height
			}),
			React.createElement('image',{
				xlinkHref : url_icon_crop,
				x: this.props.width - width,
				y: this.props.height + 2, 
				width : 24,
				height : 16
			})
		);
	}
});
