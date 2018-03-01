var mysql = require('mysql');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var dbconfig = require('./database.js');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('SET SESSION wait_timeout = 604800'); // 7 days timeout
connection.query('USE ' + dbconfig.database);
//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
exports.findByNumber = function(number, cb) {
  var query = "SELECT * FROM "+dbconfig.table.table_name+" WHERE "+dbconfig.table.number+" = "+number+" ;";
  connection.query(query, function(err, rows){
      if (err)
        return cb(err, null);
      if (rows[0]) {
        var user = {
            'id':rows[0][dbconfig.table.id],
            'number':rows[0][dbconfig.table.number],
          };
        return cb(null, user);
      } else {
        return cb(err, null);
      }
  })
};
//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
exports.addNumber = function(cb) {
  var query = "SELECT * from "+dbconfig.table.table_name+" ORDER BY "+dbconfig.table.id+" DESC LIMIT 1 ;";
  connection.query(query, function(err, rows){
    var num = 0;
    if(rows.length){
      num=rows[0][dbconfig.table.number];
    }
    num+=12001;
    num%=17576;
    var insertQuery = "INSERT INTO "+dbconfig.table.table_name+" SET "+dbconfig.table.number+" = "+num+" ;";
    connection.query(insertQuery, function(err, rows) {
      if(err) {
        console.log(err);
        return cb(err, null);
      }
      return cb(null, num);
    });
  });
};
//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
exports.numberToString = function(number) {
  var str = "";
  var resStr="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if(number<26){
    str='AA'+resStr[number];
  }
  else if(number<676){
    str='A'+resStr[~~(number/26)]+resStr[number%26];
  }
  else{
    str=resStr[~~(number/676)]+resStr[~~((number%676)/26)]+resStr[number%26];
  }
  return str;
};
//./\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..../\..
///..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\../..\.
//....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\/....\
exports.stringToNumber = function(string) {
  var num = 0;
  string=string.toUpperCase();
  var resStr="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  num+=resStr.indexOf(string[0]);
  num*=26;
  num+=resStr.indexOf(string[1]);
  num*=26;
  num+=resStr.indexOf(string[2]);
  return num;
};