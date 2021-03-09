const db = require('../dbcon');
const dbclient = db.connection;
const config = require('../config');
const fs = require('fs-extra');

getFTPUserCount = async function() {
	var rows,fields;
	[rows,fields] = await dbclient.query('SELECT COUNT(*) AS usercount FROM `users`');
	return rows[0].usercount;
}

exports.getFTPUsers = async function (offset=0, display=50) {
	var rows, fields;
	usercount = await getFTPUserCount();
	[rows,fields] = await dbclient.query('SELECT * FROM `users` LIMIT ?,?', [offset, display]);
	resultcount = rows.length;
	return {
		"recordsTotal": usercount,
		"recordsFiltered": resultcount,
		data: rows
	};
}

exports.createFTPUser = async function (username, password) {
	[rows,fields] = await dbclient.query('SELECT * FROM `users` WHERE `User` = ?', [username]);
	if(rows.length > 0) {
		return false;
	}
	userdir = config.ftpdir + '/' + username;
	await dbclient.query('INSERT INTO `users` (`User`, `Password`, `Uid`, `Gid`, `Dir`) VALUES (?, ?, ?, ?, ?)', [username, password, config.uid, config.gid, userdir]);
	// Let us create the directory
	try { 
		fs.ensureDirSync(userdir);
		fs.chownSync(userdir, config.uid, config.gid);
		return true;
	} catch (e) {
		return false;
	}
}

exports.deleteFTPUser = async function (username) {
	[rows,fields] = await dbclient.query('SELECT * FROM `users` WHERE `User` = ?', [username]);
	if(rows.length == 0) {
		return false;
	}
	await dbclient.query('DELETE FROM `users` WHERE `User` = ?', [username]);
	// Let us delete the FTP directory
	try {
		fs.removeSync(rows[0].Dir);
		return true;
	} catch (e) {
		return false;
	}
}