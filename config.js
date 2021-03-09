/**********************************
 Configuration Options:
 uid: User ID
 gid: Group ID
 ftpdir: FTP Directory for users
***********************************/

// Replace adminuser and adminpass, and keys with your own

const config = {
	uid: 1000,
	gid: 1000,
	ftpdir: '/home/pureftp',
	adminuser: 'admin',
	adminpass: 'admin',
	keys: ['',''],
	port: 9000
};

module.exports = config;