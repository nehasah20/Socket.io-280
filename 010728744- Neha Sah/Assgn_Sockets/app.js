
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);
var num = 0;
var desc ="";
var arr =["Good Shot", "Missed to field", "Classic Text Book Shot", "Hat trick", " Classical Sot", "Unbelievable miss", "Very good catch by mid-on player"]
io.on('connection',function(socket){
	console.log("connected one user");
    
	 socket.on('clientEvent', function(data){
		var interval =  setInterval(function(){
			 var rand = Math.floor(Math.random() * 6) + 1
			 num = rand + num;
			 if(rand==4 || rand == 6)
				  desc = arr[Math.floor(Math.random() * 7)]; 
			 else
				 desc = "";
			 socket.emit('test', { "description": "Score is : " +  rand  , "TotalScore" : "Total Score : " + num , "Desc" : desc });
			}, 2000);
		  });	
	 
	 socket.on('tuneOut', function(data){
		 socket.disconnect();
		  });	
	 
	//socket.on('disconnect',function(){
	//	console.log("disconnected one user");
	//});
});
