var taskPanel = false;
var panelHandleMouseMove = false;
var panelHandleMouseUp = false;
var taskDispatcher = {};

function message(msg){
	alert(msg);
}

function showNewTaskDialog(opt){
	var opt = opt || {};
	opt.key = uuid();

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
		data['board_id'] = board_id;
		data['next_x'] = this.props.next_x || 190

		apiCall(url_api_new_task , data, function(resp){
			console.log(this.state.task_id);
			if(this.state.task_id!=0){
				taskDispatcher[this.state.task_id].setState({
					data : this.state
				});
			}
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
		}, this);
	},
	getInitialState : function(){
		task_id = this.props.task_id || 0
		previous_id = this.props.previous_id || 0
		var data = this.props.data || {}
		var initData = {
			'name': data.name || '',
			'description': data.description || '',
			'assignee_user_id': data.assignee_user_id || 0,
			'task_id': task_id,
			'previous_id': previous_id
		};
		// copy all data
		for(i in data){
			initData[i] = data[i];
		}
		return initData;
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
		createInput('Assignee：', 'assignee_user_id', this, user_list),
		
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

function createInput(label, name, sender, option){
	var handleChange = function(e){
		var obj = {};
		obj[name] = e.target.value;
		sender.setState(obj)
	}

	var input = false;
	var value = sender.state[name];

	if(typeof(option)=='object'){
		var _key = '_option_create_task_'+name;
		var options = [React.createElement('option',{value:0, key:_key + '0' },'Me')];
		for( i in option ){
			option_name = option[i];
			if(!option_name){ option_name = 'null name'};
			options.push(React.createElement('option',{value:i, key:_key + i }, option_name));
		}
		input = React.createElement('select', {
			onChange : handleChange,
			name : name,
			defaultValue : value
		}, options)
	}else{
		input = React.createElement('input', {
			onChange : handleChange,
			type:'text',
			name:name,
			value: value
		})
	}
	return React.createElement('div', {

		}, 
		React.createElement('label', null, 
			label,
			input)
		)
}
