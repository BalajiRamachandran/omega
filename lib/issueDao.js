var fs = require('fs'),
	_ = require('underscore'),
	Issue = require('./Issue');

var issueDao = module.exports = {};

var home = '';
var issues = {};

issueDao.init = function (dir) {
	home = dir;
	console.log('storing issues in: ' + home);
};

function getIssueFileFromProject(project) {
	return home + project.slug + '.json';
}

issueDao.load = function (project) {
	var issueFile = getIssueFileFromProject(project);
	console.log('Loading issues from ' + issueFile);
	try {
		var issueJSON = fs.readFileSync(issueFile);
		issues[project.slug] = Issue.applyDefaults(JSON.parse(issueJSON.toString()));
	} catch (e) {
		console.log("Issue file does not appear to exist yet, but that's okay. It'll get created with the first issue.", e);
	}
	return issues[project.slug] || [];
};

issueDao.add = function (issue, project) {
	if (!issues[project.slug]) {
		issues[project.slug] = [];
	}

	issue.id = issues[project.slug].length + 1;
	issues[project.slug].push(issue);
	this.write(project);
	return issue;
};

issueDao.find = function (id, project) {
	return issues[project.slug][id-1];
};

issueDao.update = function (issue, project) {
	issues[project.slug][issue.id-1] = issue;
	this.write(project); // TODO: only persist updated
};

issueDao.write = function (project) {
	var issueFile = getIssueFileFromProject(project);
	fs.writeFile(issueFile, JSON.stringify(issues[project.slug]), function (err) {
		if (err) {
			console.log("Couldn't write issues file.");
			throw err;
		}
	});
};

issueDao.reset = function (project) {
	issues[project.slug] = [];
	this.write(project);
};