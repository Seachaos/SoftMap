// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks

//= require react
//= require react_ujs

//= require_tree .


function apiCall(url, data, onSuccess, sender){
	$.post({
		url: url,
		data : data,
		dataType: 'json',
		success : function(resp){
			if(resp.status!=0){
				message(resp.emsg);
				return;
			}
			if(!onSuccess){
				return;
			}
			if(sender){
				onSuccess.bind(sender, resp)();
				return;
			}
			onSuccess(resp);
		}, error : function(){
			message("some thing error.")
		}
	})	
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

var _urlHashCache = false;
function getURLHash(){
	var obj = {};
	try{
		var hash = window.location.hash;
		hash = hash.substring(1, hash.length);
		obj = jQuery.parseJSON(hash);
		if(!obj){ obj = {}; };
	}catch(e){ }
	return obj;
}

function setURLHash(dict){
	var obj = _urlHashCache || getURLHash();
	for(i in dict){
		obj[i] = dict[i];
	}
	_urlHashCache = obj;
	window.location.hash = JSON.stringify(obj)
}


