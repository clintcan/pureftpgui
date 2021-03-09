const express = require('express');
const app = express();
var router = express.Router();
const dbcon = require('../dbcon');
const si = require('systeminformation');
const config = require('../config');
const ftp_model = require('../models/pureftp_model');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Controller Accessed Time: ', Date.now())
//   next()
// });

router.get('/', async function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
		return false;
	}
	res.render('index');
});

router.get('/login', async function (req, res) {
	res.render('pages/login');
});

router.post('/login', async function (req, res) {
	username = req.body.username;
	password = req.body.password;
	if(config.adminuser == username && config.adminpass == password) {
		req.session.loggedIn = true;
		res.redirect('/');
		return true;
	}
	res.render('pages/login');
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
	res.render('pages/adduser');
});

router.post('/users/add', express.urlencoded({extended: true}), async function (req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
		return false;
	}
	username = req.body.username;
	password = req.body.password;
	await ftp_model.createFTPUser(username, password);
	res.redirect('/users');
});

module.exports = router;