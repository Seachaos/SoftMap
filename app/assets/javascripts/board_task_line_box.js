
var TaskLinkBox = React.createClass({
	getInitialState : function(){
		return {
			x : this.props.x || 10,
			y : this.props.y || 10,
			height : this.props.height || 100,
			width : this.props.width || 100,
			reload_sub_task : true,
			previousData : this.props.previousData || false
		}
	},
	loadTask : function(){
		apiCall(url_api_get_task,
		{
			previous_id : this.props.data.id,
			board_id : board_id
		}, function(resp){
			var previousData = this.props.data;
			var task_array = resp.tasks.map(function(task){
				return React.createElement(TaskLinkBox, {
					data:task,
					x: task.x,
					y: task.y,
					key: 'task_link_id_' + task.id,
					previousData : previousData
				});
			});
			if(task_array.length>0){
				this.setState({
					reload_sub_task : false,
					sub_tasks : task_array
				});
			}
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
		this.setState({
			savePosition : true
		})
	},
	handleMouseOut : function(e){
		panelHandleMouseMove = this.handleMouseMove;
	},
	handleClickNewSubTask : function(e){
		var data = this.props.data;
		showNewTaskDialog({
			previous_id : data.id,
			previous_name : data.name
		});
	},
	savePosition : function(){
		savePosition = false;
		apiCall(url_api_save_position, {
			task_id : this.props.data.id,
			x : this.state.x,
			y : this.state.y
		});
	},
	render: function(){
		var data = this.props.data;
		var transform = 'translate('+this.state.x+', ' + this.state.y + ')';
		taskDispatcher[data.id] = this;
		if(this.state.savePosition){
			this.savePosition();
		}
		var _x_add_tag = 72;

		// prepare link line
		var link_line = null;
		if(this.state.previousData){ // if has previous data
			var previousData = this.state.previousData;
			link_line = React.createElement('line', {
				className : 'svg_link_line',
				x1 : 100,
				y1 : 60,
				x2 : this.state.x,
				y2 : this.state.y + this.state.height / 2
			});
		}

		if(this.state.reload_sub_task){
			this.loadTask();
		}

		// return render
		var box =  React.createElement('g', {
				className : 'task_link_box',
				transform : transform
			},
			this.state.sub_tasks,
			// ---- content ----
			// background
			React.createElement('rect', {
				className : 'svg_task_box',
				width : this.state.width,
				height : this.state.height
			}),
			// name
			React.createElement('text', { x:20, y:20 }, data.name),
			// description
			React.createElement('text', { x:20, y:50 }, data.description),
			// move taq
			React.createElement('g',{
					onMouseMove : this.handleMouseMove,
					onMouseDown : this.handleMouseDown,
					onMouseUp : this.handleMouseUp,
					onMouseOut : this.handleMouseOut,
					className : 'svg_move_tag_g'
				},
				React.createElement('rect', {
					className : 'svg_move_tag',
					width : 48,
            		height : 20,
					y:-20
				}),
				React.createElement('text', { x:5, y: -5}, 'Move')
			),
			// new tag
			React.createElement('g',{
					className : 'svg_new_tag_g',
					onClick : this.handleClickNewSubTask
				},
				React.createElement('rect', {
					className : 'svg_add_tag',
		            width : 28,
		            height : 20,
					x:_x_add_tag,
					y:-20
				}),
				React.createElement('text', { x:_x_add_tag+10 , y: -5}, ' + ')
			),
			// resize
			React.createElement(TaskLinkBoxButtonResize, {
				data : data
			})
			// ------ end ----
		);
		return React.createElement('g', null,
			link_line,
			box);
	}
});

var TaskLinkBoxButtonResize = React.createClass({
	render : function(){
		var data = this.props.data;
		var width = 60;
		var height = 20;
		return React.createElement('g', {
				className : 'svg_new_tag_g'
			},
			React.createElement('rect', {
				className : 'svg_add_tag',
	            width : width,
	            height : height,
				x: data.width - width,
				y: data.height
			}),
			React.createElement('text', {
				x: data.width - width + 5,
				y: data.height + 16 }, 'TODO')
		);
	}
});
