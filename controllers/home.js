const express = require('express');
const app = express();
var router = express.Router();
const dbcon = require('../dbcon');
const si = require('systeminformation');
const config = require('../config');
const ftp_model = require('../models/pureftp_model');
const striptags = require('striptags');

var { randomBytes } = require('crypto'); // for creating CSRF Token



router.get('/', async function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
		return false;
	}
	if (req.session.csrf === undefined) {
		req.session.csrf = randomBytes(100).toString('base64');
	}
	res.render('index', { csrfToken: req.session.csrf });
});

router.get('/login', async function (req, res) {
	req.session.csrf = randomBytes(100).toString('base64');
	res.render('pages/login', { csrfToken: req.session.csrf });
});

router.post('/login', async function (req, res) {
	username = req.body.username;
	password = req.body.password;
	isCSRFVerified = !((!req.body._csrf) || (req.body._csrf !== req.session.csrf));
	if(config.adminuser == username && config.adminpass == password && isCSRFVerified) {
		req.session.loggedIn = true;
		res.redirect('/');
		return true;
	}
	req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
	res.render('pages/login', { csrfToken: req.session.csrf });
});

router.get('/logout', async function (req, res) {
	req.session.loggedIn = null;
	res.redirect('/login');
});

router.get('/users', async function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
		return false;
	}
	res.render('pages/ftpusers');
});

router.get('/users/add', async function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
		return false;
	}
	req.session.csrf = randomBytes(100).toString('base64');
	res.render('pages/adduser', { csrfToken: req.session.csrf });
});

router.post('/users/add', express.urlencoded({extended: true}), async function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
		return false;
	}
	username = striptags(req.body.username);
	password = req.body.password;
	isCSRFVerified = !((!req.body._csrf) || (req.body._csrf !== req.session.csrf));
	if (isCSRFVerified) {
		await ftp_model.createFTPUser(username, password);
	}
	res.redirect('/users');
});

module.exports = router;