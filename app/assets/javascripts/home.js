

function message(msg){
	alert(msg);
}

var taskPanel = false;
var panelHandleMouseMove = false;

var TaskLink = React.createClass({
	getInitialState : function(){
		return {
			x : this.props.x || 10,
			y : this.props.y || 10
		}
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
	savePosition : function(){
		savePosition = false;
		apiCall('api/save_position', {
			task_id : this.props.data.id,
			x : this.state.x,
			y : this.state.y
		});
	},
	render: function(){
		var data = this.props.data;
		var transform = 'translate('+this.state.x+', ' + this.state.y + ')';
		if(this.state.savePosition){
			this.savePosition();
		}
		var _x_add_tag = 72;
		return React.createElement('g', {
				className : 'task_link_box',
				transform : transform,
			},
			// ---- content ----
			// background
			React.createElement('rect', {
				className : 'svg_task_link'
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
					y:-20
				}),
				React.createElement('text', { x:5, y: -5}, 'Move')
			),
			// new tag
			React.createElement('g',{
					className : 'svg_new_tag_g'
				},
				React.createElement('rect', {
					className : 'svg_add_tag',
					x:_x_add_tag,
					y:-20
				}),
				React.createElement('text', { x:_x_add_tag+10 , y: -5}, ' + ')
			)
			// ------ end ----
		);
	}
});

var TaskPanel = React.createClass({
	loadTask : function(){
		apiCall('api/get_task.json',
		{
			previous_id : 0
		}, function(resp){
			this.setState({
				tasks : resp.tasks,
				loading : false
			});
		}, this);
	},
	handleMouseMove : function(e){
		if(panelHandleMouseMove){
			panelHandleMouseMove(e);
		}
	},
	onWindowSizeChange : function(){
		this.setState({
			onWindowsSizeChange : true
		});
	},
	getInitialState : function(){
		$(window).resize(this.onWindowSizeChange);
		taskPanel = this;
		return {
			loading : true
		};
	},
	render : function(){
		if(this.state.loading){
			this.loadTask();
			return React.createElement('h1', null, 'Loading');
		}
		var y = 0;
		var task_array = this.state.tasks.map(function(task){
			y += 70;
			return React.createElement(TaskLink, {
				data:task,
				x: task.x,
				y: task.y,
				key: 'task_link_id_' + task.id
			});
		});
		return React.createElement('svg', {
			onMouseMove : this.handleMouseMove,
			width : panel_width,
			height : panel_height
		}, task_array);
	}
});

var CreateTask = React.createClass({
	saveTask : function(){
		var data = {};
		for(key in this.state){
			data['task['+key+']'] = this.state[key];
		}
		apiCall('api/new_task.json' , data, function(resp){
			if(taskPanel){
				taskPanel.setState({
					loading : true
				});
			}
			$.facebox.close();
		});
	},
	getInitialState : function(){
		return {
			'name':'',
			'description':''
		}
	},
	render : function(){
		return React.createElement('div', {

		},
		createInput('TaskName：', 'name', this),
		createInput('Description：', 'description', this),
		React.createElement('div', {
			className:'button',
			onClick : this.saveTask
		}, 'Save') );
	}
})

var NewTask = React.createClass({
	handleClick: function(){
		$.facebox('<div id="create_task_dialog" />');
		RenderCreateTask(document.getElementById('create_task_dialog'));
	},
	render: function(){
		return React.createElement('span',{
			className:'button',
			onClick:this.handleClick
		}, 'NewTask');
	}
});

function createInput(label, name, sender){
	var handleChange = function(e){
		var obj = {};
		obj[name] = e.target.value;
		sender.setState(obj)
	}
	return React.createElement('div', {

		}, 
		React.createElement('label', null, 
			label,
			React.createElement('input', {
				onChange : handleChange,
				type:'text',
				name:name,
				value: sender.state[name]
			}))
		)
}
function RenderCreateTask(dom){
	ReactDOM.render(React.createElement(CreateTask), dom);
}
