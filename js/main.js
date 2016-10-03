function Application(){
	this.objects = [];
	this.rowsRendered = 0;
	this.windowHeight = 0; // to be calculated on document ready
	this.tableHeight = 0; // to be calculated on each incremental render
	this.defaultTab = '#page-hello';
	// constants
	this.ROWS_LENGTH = 256;
	this.COLUMNS_LENGTH = 8;
	this.ROW_HEIGHT = 32;
}

Application.prototype.init = function(){
	var _this = this;
	
	// navigation and history
	
	$('#page-nav a').click(function(){
		var id = $(this).attr('href');
		//console.log('push');
		_this.showTab(id);
		history.pushState({id: id}, $(this).text(), id);
		return false;
	});
	
	window.onpopstate = function(event) {
		//console.log('pop');
		_this.showTab(event.state ? event.state.id : _this.defaultTab);
	};
	
	this.showTab(location.hash || this.defaultTab);
	$('#page-nav, #pages').show();
	
	// scroll and incremental render
	
	var $table = $('#table');
	var pagesMargin = parseInt($('#pages').css('margin-top'));
	this.windowHeight = $(window).height();
	
	$(window).scroll(function(){
		if (_this.tableHeight - $(window).scrollTop() + pagesMargin <= _this.windowHeight){
			_this.renderObjects();
		}
	});
	
	$table.on('click', 'td', function(){
		var color = $(this).data('color');
		$(this).animate({backgroundColor: color}, 1000); // required plugin: jquery.animate-colors
	});
	
	this.generateObjects();	
	this.renderObjects();
}

Application.prototype.generateObjects = function(){
	for (var i = 0; i < this.ROWS_LENGTH; i++){
		var row = [];
		this.objects.push(row);
		for (var j = 0; j < this.COLUMNS_LENGTH; j++){
			var object = this.generateObject();
			this.objects[i].push(object);
		}
	}
}

Application.prototype.generateObject = function(){
	var object = {};
	var id = this.getRandomInt(0, this.ROWS_LENGTH * this.COLUMNS_LENGTH);
	object.id = id;
	object.name = 'name-'+id;
	object.color = this.getRandomColor();
	return object;
}

Application.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Application.prototype.getRandomColor = function(){
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

Application.prototype.renderObjects = function(){
	var html = '';
	var rowsToRender = Math.floor(this.windowHeight / this.ROW_HEIGHT) + 10;
	var counter = 0;
	for (var i = this.rowsRendered; i < Math.min(this.rowsRendered + rowsToRender, this.objects.length); i++){
		var row = this.objects[i];
		html += '<tr>';
		for (var j = 0; j < row.length; j++){
			var object = row[j];
			html += this.renderObject(object);
		}
		html += '</tr>';
		counter++;
	}
	if (!counter){
		return;
	}
	$('#table').append(html);
	//console.log('rendered '+counter+' rows, started from '+this.rowsRendered);
	this.rowsRendered += rowsToRender;
	this.tableHeight = $('#table').height();
}

Application.prototype.renderObject = function(object){
	var html = '<td data-color="'+object.color+'">'+
		object.name+
	'</td>';		
	return html;
}

Application.prototype.showTab = function(id){
	//console.log(id);
	$('#page-nav a[href="'+id+'"]').parent().addClass('active').siblings('.page-nav').removeClass('active');
	$(id).addClass('active').siblings('.page').removeClass('active');
}

$(document).ready(function(){
	var app = new Application();
	app.init();
});