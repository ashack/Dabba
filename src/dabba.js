/*
Copyright (c) 2012 Ashwinee Dash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function (context) {

//create the empty object if already not available
var Dabba = {} || window.Dabba;

// overwriting any other Dabba object with this object
window.Dabba = Dabba;

var _wls = window.localStorage;
//TODO
Dabba.adapter = {

    storage: 'dom'//
};

 //
var cache = {}, // useful for caching objects

//TODO 
//check if localStorage is available
 isLocalStorage = function () {
	//function supports_html5_storage() {
	// taken from modernizer https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage-localstorage.js
  try {
      localStorage.setItem('mod', 'mod');
      localStorage.removeItem('mod');
      return true;
  } catch (e) {
      return false;
  }
}

// creates the new corner using the create method
var _init = function(name/*name of the corner*/, keys/* name of the columns*/) {
		// check if localstorage is available
		if(!isLocalStorage()) {
			// TO DO
			console.log("local storage is not available.") // need to check if console is available
			return; // object cannot be created hence no need to go further
		}
			

		// check if a key with same name exists
		/*if(!(_wls.getItem(name))) {

			var sd = new ls(name);
			return sd;// since same key exists , there is no need to go further
		}*/
		
		// if some other script creates any item with provided key
		if (!(_wls.getItem(name))) {// if the key is not found 
			_create(name, keys);
		} else {
			//raise exception;
		};	
		
	};

var _create = function (name/*name of the corner*/, keys/* name of the columns*/) {

	var sd = new ls(name)
		,tmpVal1 = sd.name + ".totalrecords"/* this will keep a tab on how many rows of data is set*/
		,tmpVal2 = sd.name + ".keys"
		,tmpVal3 = sd.name + ".ids";
		localStorage.setItem(tmpVal1, '0');
		localStorage.setItem(tmpVal3, '0');
		keys.id = "number";
		keys.create_date = "datetime";
		keys.update_date = "datetime";
		wls.setItem(tmpVal2, JSON.stringify(keys));
		return sd;
}
var _ls = function (name/*string*/) {
		var _name = name;
		//if(_wls.getItem(_name) !== undefined) {
			//this.uid = wls.getItem(_name);
			this.name = _name;
			//
		//} else {
			// raise exception
		//} 
		_wls.setItem(_name,getUID());
			
}

_ls.prototype.add = function(data) {
	var i = parseInt(wls.getItem(this.name + ".ids"),10);
	//data.id = ++i;
	var trs = parseInt(wls.getItem(this.name + ".totalrecords"));
	wls.setItem(this.name + ".totalrecords", ++trs);
	var keys = JSON.parse(wls.getItem(this.name+'.keys'));
	var items = {};
	
	for (var key in keys) {
			items[key] = data[key] || ''; //looping through object 
	}
	items.id = ++i;
	items.create_date = new Date();// should be javascript date so that later on it can be compared
	items.update_date = items.create_date;
	localStorage.setItem(this.name+"."+i, JSON.stringify(items));
	localStorage.setItem(this.name + ".ids", i);
};

//TODO
_ls.prototype.edit = function(id/* number*/, data/*{key: value, key:value}*/) {
	var idn = this.name +'.'+ id;
	var item = this.find(id);//this{};
	if(item != null) {

		//item = //JSON.parse(localStorage.getItem(id));//parseInt(localStorage.getItem(this.name + ".totalrecords"),10);
		for (var key in data) {
			item[key] = data[key]; //looping through object 
		}
		item.update_date = new Date();
		localStorage.setItem(idn, JSON.stringify(item));
	}
};

_ls.prototype.find = function(id/* number*/) {
	// body...
	var id = this.name +"."+ parseInt(id, 10);

	if(itemExists(id)) {
		var item = localStorage.getItem(id); // if the item is deleted or not added it might retrun undefined
		item = JSON.parse(item);//parseInt(localStorage.getItem(this.name + ".totalrecords"),10);
		return item;
	}
	return null;
};

_ls.prototype.findAll = function(from/*number optional*/, to/* number optional*/) {
	// body...
	var records = [];
	var length = parseInt(localStorage.getItem(this.name+ ".ids"));
	var i = 1;
	if(arguments.length == 0) {
		//
		fetch.apply(this);
	} else if (arguments.length == 1 && arguments[0] < 1) {
		i = parseInt(to, 10);
		fetch.apply(this);
	} else if (arguments.length == 2 && arguments[0] > 0 && arguments[1] > 1) {
		i = parseInt(to, 10);
		length = parseInt(from, 10);
		fetch.apply(this);
	} else {
		console.log('parameters for this method : from/*number optional*/, to/* number optional*/');
		return;
	};


	function fetch (){
		var j = 0;
		for ( i; i <= length; i++) { // TODO
			//var id = this.name + "."+i;
			
			var item = this.find(i);
			// adding to the list if object exists for this id
			if(item != null) {
				records[j] = item;
				j++;
			}
			
		};
	}
		

	return records;
};

_ls.prototype.remove = function(id /* number*/) {
	var id = this.name +"."+ parseInt(id, 10);
	if(itemExists(id)) {
		localStorage.removeItem(id);
		var trs = parseInt(localStorage.getItem(this.name + ".totalrecords"),10);
		localStorage.setItem(this.name + ".totalrecords", --trs);
		return true;
	}
	return false;
};

_ls.prototype.firstPage = function(number/*size of the records to be returned*/) {
	if(number > 0 && number !== NaN) {
	this.recordsPerPage = number;
	this.page = 1;
	this.findAll(1, this.recordsPerPage);
	}

	
	//return this.recordsPerPage;
};

_ls.prototype.nextPage = function() {
	// body...
	if(!this.page) {
		console.log('firstPage method must be called first');
		return;
	}
	var from = (this.recordsPerPage * this.page) + 1;
	var to = this.recordsPerPage * (this.page+1)
	this.findAll(from, to);
	this.page++;
};

_ls.prototype.prevPage = function() {
	// body...
	if(!this.page) {
		console.log('firstPage method must be called first and nextPage ');

		return;
	}

	if(this.page > 1) {
		console.log('looks like you are on first page itself');
		return;
	}

	this.page--;
	
	if(this.page == 1) {
		this.findAll(1, this.recordsPerPage);
	} else {
		var to = (this.recordsPerPage * this.page ) + 1;
		var from = this.recordsPerPage * (this.page+1);
		this.findAll(from, to);
	}
	
};


// utils

// get the uid 
// returns a unique identifier (by way of Backbone.localStorage.js)
// TODO investigate smaller UUIDs to cut on storage cost
// why this is required ??
function getUID () {
        var S4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	//return "xxx-000-xxxx-00-xxxxx";
}

function itemExists(itemName) {
	if(localStorage.getItem(itemName) !== undefined) {
		return true;
	} else {
		return false;
	}
}

//public API
Dabba.help = (function(){


	return {

	version: "0.1.1a.2"
	//public API
	,create: _create//function(name, keys){ init(name, keys); }
	,modify: ''// add or remove key and corresponding values
	,destroy: ''
	,reset: ''
	,has: itemExists
	,toJSON: ''
	,replicate: ''

};

}())

}(window));

 
//
