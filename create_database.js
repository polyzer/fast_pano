/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('./db/database')
var connection = mysql.createConnection(dbconfig.connection);

connection.query('DROP DATABASE ' + dbconfig.database);

connection.query("CREATE DATABASE " + dbconfig.database + " DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;");

connection.query('USE ' + dbconfig.database);

connection.query('\
CREATE TABLE `tablename` (\
	`id` INT NOT NULL AUTO_INCREMENT,\
	`number` INT NOT NULL,\
	PRIMARY KEY (`id`)\
)');

console.log('Success: Database Created!')

connection.end();
