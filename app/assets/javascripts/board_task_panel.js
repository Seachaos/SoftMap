
var TaskPanel = React.createClass({
	loadTask : function(){
		apiCall(url_api_get_task,
		{
			previous_id : 0,
			board_id : board_id
		}, function(resp){
			var canEdit = this.state.canEdit;
			var task_array = resp.tasks.map(function(task){
				return React.createElement(TaskLinkBox, {
					data:task,
					x: task.x,
					y: task.y,
					canEdit : canEdit,
					key: 'task_link_id_' + task.id
				});
			});
			this.setState({
				tasks : resp.tasks,
				task_array : task_array,
				loading : false
			});
		}, this);
	},
	handleMouseMove : function(e){
		if(panelHandleMouseMove){
			panelHandleMouseMove(e);
		}
	},
	spaceDragMove : function(e){
		var diffX = e.pageX - this.actionX;
		this.actionX = e.pageX;
		var x = this.state.x + diffX;
		var diffY = e.pageY - this.actionY;
		this.actionY = e.pageY;
		var y = this.state.y + diffY;
		this.setState({
			x: x,
			y: y
		});
	},
	handleMouseDown : function(e){
		if(this.inDragMode){
			this.actionX = e.pageX;
			this.actionY = e.pageY;
			panelHandleMouseMove = this.spaceDragMove;
		}
	},
	handleMouseUp : function(e){
		panelHandleMouseMove = false;
		if(panelHandleMouseUp){
			panelHandleMouseUp(e);
		}
	},
	handleMouseOut : function(e){
		// panelHandleMouseMove = false;
	},
	handleKeydown : function(e){
		var code = event.which || event.keyCode;
		if(code==32){
			$('#svg_task_panel').css('cursor', 'move');
			this.inDragMode = true;
		}
	},
	handleKeyup : function(e){
		this.inDragMode = false;
		$('#svg_task_panel').css('cursor', '');
	},
	onWindowSizeChange : function(){
		this.setState({
			onWindowsSizeChange : true
		});
	},
	getInitialState : function(){
		$(window).resize(this.onWindowSizeChange);
		$(window).keydown(this.handleKeydown);
		$(window).keyup(this.handleKeyup);
		taskPanel = this;
		return {
			canEdit : this.props.canEdit || false,
			loading : true,
			x : 0,
			y : 0
		};
	},
	render : function(){
		if(this.state.loading){
			this.loadTask();
			return React.createElement('h1', null, 'Loading');
		}
		var transform = 'translate('+this.state.x+', ' + this.state.y + ')';
		return React.createElement('svg', {
			id : 'svg_task_panel',
			xmlns : "http://www.w3.org/2000/svg",
			onMouseMove : this.handleMouseMove,
			onMouseUp : this.handleMouseUp,
			onMouseOut : this.handleMouseOut,
			onMouseDown : this.handleMouseDown,
			width : panel_width,
			height : panel_height,
		}, React.createElement('g', {
			transform : transform
		}, this.state.task_array));
	}
});