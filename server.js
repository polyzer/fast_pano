var express = require('express');
var path = require('path');
var db = require('./db');
const url = require('url');  
const fileUpload = require('express-fileupload');
var querystring = require('querystring');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var ourSite = "http://skyfox.team:3874";
var execFile = require('child_process').execFile;
var fs = require('fs');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(fileUpload({
  limits: { fileSize: 3 * 1024 * 1024 }
}));

//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
app.get('/',
  function(req, res){
  	var message = req.query.message;
  	var url = req.query.url;
  	if(!message)
  		url=0;
  	if(!message)
  		message=0;
    res.render('index', {message:message, url:url});
  }); 

app.post('/upload', function(req, res) {
  if (!req.files.sampleFile){
	res.redirect(url.format({
     pathname:"/",
     query: {
        "message": 1
      }
    }));  
  }
  else{
	var sampleFile = req.files.sampleFile;
	if(sampleFile.mimetype!=='image/jpeg'){
		res.redirect(url.format({
	     pathname:"/",
	     query: {
	        "message": 2
	      }
	    }));
	}
	else{
		if(sampleFile.truncated){
			res.redirect(url.format({
		     pathname:"/",
		     query: {
		        "message": 3
		      }
		    }));
		}
		else{
			// Use the mv() method to place the file somewhere on your server
			sampleFile.mv('views/uploadFiles/FILE'+sampleFile.name, function(err) {
				if (err)
				  return res.status(500).send(err);
				execFile('file',['-b','--mime-type','views/uploadFiles/FILE'+sampleFile.name],function(error,stdout,stderr) {
				    if(stdout.trim()!=='image/jpeg'){
				    	fs.stat('views/uploadFiles/FILE'+sampleFile.name, function (err, stats) {
						   if (err) {
						       return console.error(err);
						   }
						   fs.unlink('views/uploadFiles/FILE'+sampleFile.name,function(err){
						        if(err) return console.log(err);
						        res.redirect(url.format({
							     pathname:"/",
							     query: {
							        "message": 2
							      }
							    }));
						   });  
						});
				    }
				    else{
				    	db.tables.addNumber(function(err, number){
				    		fs.rename('views/uploadFiles/FILE'+sampleFile.name, 'views/uploadFiles/'+number+'.jpg', function(err) {
							    if ( err ) console.log('ERROR: ' + err);
							    var str = db.tables.numberToString(number);
						    	res.redirect(url.format({
							     pathname:"/",
							     query: {
							        "message": 4,
							        "url":str
							      }
							    }));
							});
				    	});
				    }
				});
			});	
		}
	}	
  }
});
//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
app.get('/*',
  function(req, res) {
  	var str = req.url.substring(1);
  	var number = db.tables.stringToNumber(str);
  	db.tables.findByNumber(number, function(err, user){
  		if(err){
  			console.log(err);
  			res.redirect('/');
  		}
  		else{
  			res.render('index1',{image:number});
  		}
  	});
  });
//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
app.post('/*',
  function(req, res) {
    res.redirect('/');
  });

app.listen(3874);