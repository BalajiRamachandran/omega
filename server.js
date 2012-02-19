#!/usr/bin/env node

var express = require('express'),
	_ = require('underscore'),
	projectDao = require('./lib/projectDao');

// command line parameters
var argv = require('optimist')
	.options('port', {
		alias: 'p',
		default: 1337
	})
	.options('optimized', {
		alias: 'opt',
		default: false
	})
	.argv;

var PORT = process.env.app_port || argv.port;
// run with --optimized to use 'public-built/' directory
// build 'public-built/' using 'node r.js -o app.build.js'
var www_public = argv.optimized ? '/public-built' : '/public';

var app = express.createServer(
	express.logger(),
	express.static(__dirname + www_public)
);
app.register('.html', require('ejs')); // call our views html
app.use(app.router);
app.listen(PORT);

app.get('/', function (req, res) {
	res.end('intro page where you create projects etc');
});
app.get('/project', function(req, res) {
	res.end('Projects are unlisted. Try /project/<name>');
});
app.get('/project/:slug', function(req, res) {
	var project = projectDao.find(req.params.slug);
	if (project) {
		res.render('project.html', { title: project.name, layout: false });
	} else {
		res.writeHead(404);
		res.end('No such project');
	}
});

console.log('App running at http://127.0.0.1:' + PORT);

require('./lib/tracker').init(app);
