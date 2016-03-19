var taskPanel = false;
var panelHandleMouseMove = false;
var taskDispatcher = {};

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

var CreateTaskDialog = React.createClass({
	saveTask : function(){
		var data = {};
		var task_dispatch_id = false;
		for(key in this.state){
			var value = this.state[key];
			data['task['+key+']'] = value;

			// check who need refresh
			if(!task_dispatch_id){
				if(key=='previous_id'&& value != 0){
					task_dispatch_id = value;
				}else if(key=='task_id'&&value != 0){
					task_dispatch_id = value
				}
			}
		}
		apiCall('api/new_task.json' , data, function(resp){
			if(task_dispatch_id){
				taskDispatcher[task_dispatch_id].setState({
					reload_sub_task : true
				})
			}else if(taskPanel){
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
