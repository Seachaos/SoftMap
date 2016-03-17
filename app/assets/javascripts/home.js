

function message(msg){
	alert(msg);
}

var taskPanel = false;

var TaskLink = React.createClass({
	render: function(){
		var data = this.props.data;
		return React.createElement('div', {
			className : 'task_link_box'
		},
			React.createElement('h3', null, data.name),
			React.createElement('div', null, data.description) );
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
	getInitialState : function(){
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
		var task_array = this.state.tasks.map(function(task){
			return React.createElement(TaskLink, {
				data:task,
				key: 'task_link_id_' + task.id
			});
		});
		return React.createElement('div', null, task_array);
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
