

function message(msg){
	alert(msg);
}

function showNewTaskDialog(opt){
	var opt = opt || {};

	$.facebox('<div id="create_task_dialog" />');
	ReactDOM.render(
		React.createElement(CreateTaskDialog,
			opt),
		document.getElementById('create_task_dialog'));
}

var taskPanel = false;
var panelHandleMouseMove = false;

var TaskLink = React.createClass({
	getInitialState : function(){
		this.loadTask()
		return {
			x : this.props.x || 10,
			y : this.props.y || 10,
			height : this.props.height || 100,
			previousData : this.props.previousData || false
		}
	},
	updatePreviousData : function(data){
		console.log('CALL');
		this.setState({ previousData: data });
	},
	loadTask : function(){
		apiCall('api/get_task.json',
		{
			previous_id : this.props.data.id
		}, function(resp){
			var previousData = this.props.data;
			var task_array = resp.tasks.map(function(task){
				return React.createElement(TaskLink, {
					data:task,
					x: task.x,
					y: task.y,
					key: 'task_link_id_' + task.id,
					previousData : previousData
				});
			});
			if(task_array.length>0){
				this.setState({
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

		// return render
		var box =  React.createElement('g', {
				className : 'task_link_box',
				transform : transform,
			},
			this.state.sub_tasks,
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
					className : 'svg_new_tag_g',
					onClick : this.handleClickNewSubTask
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
		return React.createElement('g', null,
			link_line,
			box);
	}
});

var TaskPanel = React.createClass({
	loadTask : function(){
		apiCall('api/get_task.json',
		{
			previous_id : 0
		}, function(resp){
			var task_array = resp.tasks.map(function(task){
				return React.createElement(TaskLink, {
					data:task,
					x: task.x,
					y: task.y,
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
		return React.createElement('svg', {
			onMouseMove : this.handleMouseMove,
			width : panel_width,
			height : panel_height
		}, this.state.task_array);
	}
});

var CreateTaskDialog = React.createClass({
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
		task_id = this.props.task_id || 0
		previous_id = this.props.previous_id || 0
		return {
			'name':'',
			'description':'',
			'task_id': task_id,
			'previous_id': previous_id
		}
	},
	render : function(){
		var title = null;
		if(this.props.previous_name){
			title = React.createElement('h3', {}, 'Sub task in :' + this.props.previous_name);
		}
		return React.createElement('div', {

		},
		title,
		createInput('TaskName：', 'name', this),
		createInput('Description：', 'description', this),
		React.createElement('input', {type:'hidden', name: 'task_id', value: this.state.task_id}),
		React.createElement('input', {type:'hidden', name: 'previous_id', value: this.state.previous_id}),
		React.createElement('div', {
			className:'button',
			onClick : this.saveTask
		}, 'Save') );
	}
})

var NewTask = React.createClass({
	handleClick: function(){
		showNewTaskDialog();
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
