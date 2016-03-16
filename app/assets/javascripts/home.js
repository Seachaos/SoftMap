

var CreateTask = React.createClass({
	saveTask : function(){
		// alert('SAVE');
		// console.log(this.state);
	},
	getInitialState : function(){
		return {
			'task_name':'',
			'description':''
		}
	},
	render : function(){
		return React.createElement('div', {

		},
		createInput('TaskName：', 'task_name', this),
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

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function uuid(){
	return guid();
}
