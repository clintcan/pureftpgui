const express = require('express');
const app = express();
var router = express.Router();
const dbcon = require('../dbcon');
const ftp_model = require('../models/pureftp_model');
const si = require('systeminformation');
const { encode, decode } = require('html-entities');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('API Controller Accessed Time: ', Date.now())
//   next();
// });

router.get('/', async (req, res) => {
	res.send('hello world');	
});

router.get('/ftpusers', async (req, res) => {
	if (!req.session.loggedIn) {
		res.send({
			error: 'permission denied'
		});
		return false;
	}
	draw = req.params.draw;
	start = req.params.start;
	display = req.params.length;
	results = await ftp_model.getFTPUsers(start, display);
	usercount = results.recordsTotal;
	resultcount = results.recordsFiltered;
	resultdata = results.data;
	data = new Array();
	var i;
	for(i=0; i<resultdata.length; i++) {
		arr = [
			encode(resultdata[i].User),
			resultdata[i].Uid,
			resultdata[i].Gid,
			resultdata[i].Dir,
		];
		data.push(arr);
	}
	// console.dir(ftp_model)
	tmp = {
		"draw": draw,
		"recordsTotal": usercount,
		'recordsFiltered': resultcount,
		"data": data
	}
	res.send(tmp);
});

router.get('/sysinfo', async (req, res) => {
	if (!req.session.loggedIn) {
		res.send({
			error: 'permission denied'
		});
		return false;
	}
	si.cpu()
		.then((data) => {
			cpu = data;
			si.mem()
				.then((data) => {
					memory = data;
					si.system()
						.then((data) => {
							system = data;
							var data2 = {
								cpu: cpu.manufacturer + ' ' + cpu.brand + ' ' + cpu.speed + 'Ghz',
								memorytotal: (memory.total/1073741824).toFixed(2) + 'GB',
								memoryfree: (memory.free/1073741824).toFixed(2) + 'GB Free',
								memoryused: (memory.used/1073741824).toFixed(2) + 'GB Used',
								hw: system.manufacturer + ' ' + system.model + ' ' + system.version
							}
							res.send(data2);
						})
				})
		})
		.catch((err) => {
			console.error(err);
			data = {
				cpu: '',
				memorytotal: '',
				memoryfree: '',
				memoryused: ''
			}
			res.send(data)
		})
	// cpu = await si.cpu();
	// memory = await si.mem();
	// system = await si.system();
	// var data = {
	// 	cpu: cpu.manufacturer + ' ' + cpu.brand + ' ' + cpu.speed + 'Ghz',
	// 	memorytotal: (memory.total/1073741824).toFixed(2) + 'GB',
	// 	memoryfree: (memory.free/1073741824).toFixed(2) + 'GB Free',
	// 	memoryused: (memory.used/1073741824).toFixed(2) + 'GB Used',
	// 	hw: system.manufacturer + ' ' + system.model + ' ' + system.version
	// }
	// res.send(data);
});

// This adds a pureftpd user
router.post('/ftpusers', express.urlencoded({extended: true}), async (req, res) => {
	if (!req.session.loggedIn) {
		res.send({
			error: 'permission denied'
		});
		return false;
	}
	// Getting the username and password
	username = req.body.username;
	password = req.body.password;
	result = ftp_model.createFTPUser(username, password);
	res.send({
		message: result
	});
});

// Delete a user
router.delete('ftpusers', express.urlencoded({extended: true}), async function(req, res) {
	if (!req.session.loggedIn) {
		res.send({
			error: 'permission denied'
		});
		return false;
	}
	username = req.body.username;
	ftp_model.deleteFTPUser(username);
	res.send({
		message: true
	})
});


module.exports = router;