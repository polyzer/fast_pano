/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': '1'
    }
};
var connection = mysql.createConnection(dbconfig.connection);

connection.query("CREATE USER 'generator_user'@'localhost' IDENTIFIED BY '1';");

connection.query('GRANT ALL PRIVILEGES ON * . * TO `generator_user`@`localhost`;');

connection.query('FLUSH PRIVILEGES;');

console.log('Success: user created!');

connection.end();