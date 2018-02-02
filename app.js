//Definitions
var express = require('express')
var cons = require('consolidate')
var app = express()
var expressLess = require('express-less');
var WorkflowManager = require('intellect-ui-workflow-engine');


Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

var pageRenderingEngine = {
    data: {},

    getValue(var_name) {
        const result = this.data[var_name];
        return result;
    },

    interpreter(code) {
        return [true, false, false, false, false, true, false, false].randomElement();
    }
}

var workflowManager = new WorkflowManager({interpreter: pageRenderingEngine.interpreter}).init();

var pageList = workflowManager.getPage('first', {'moduleName': 'coverage_type'});
console.log("get the first page of a particular workflow module: getPage('first', {'moduleName': 'coverage_type'})");
console.log(pageList);
console.log("");



// Set Mustache as the Template Engine
app.engine('html', cons.mustache);

// Set up Views and Partials
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Set up Static Files
app.use('/', express.static('assets'));

// Set up LESS
app.use('/css', expressLess(__dirname + '/assets/less', { compress: true }));

// Index Page
app.get('/', function (req, res){
	res.render('index', 
	  {
		title: 'Home',
		partials : {
			head : '/partials/head'
		}
	  });
});

// All Errors Except for 404 Page.
app.use(function(err, req, res, next){
	var requestedURL = req.protocol + '://' + req.get('Host') + req.url;	
	console.error(err.stack);
	console.log(err.stack + '  URL: ' + requestedURL);
	res.render('error', {title: err.stack});
});

// 404 Error Page. MUST BE LAST (except for server).
app.use(function(req, res, next){
	var requestedURL = req.protocol + '://' + req.get('Host') + req.url;
	console.log('Error: 404 - ' + requestedURL );
	res.render('error', {title: '404'});
});

// Set the Server Up
var server = app.listen(3002, function() {
	var host = server.address().address
	var port = server.address().port
	console.log('App is listening at http://%s:%s', host, port)
});
