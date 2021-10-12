
var mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
  host : 'db-mysql-blr1-56981-do-user-9676911-0.b.db.ondigitalocean.com',
  user: 'doadmin',
  password : 'a0xe66knpqoeoy0i',
  database: 'lapify',
  port:'25060' ,
  multipleStatements: true
  })


module.exports = pool;




// var mysql = require('mysql')
// require('dotenv').config()

// const pool = mysql.createPool({
 
//  host : 'localhost',
//    user: 'root',
//     password : '123',
//     database: 'recharge',
//     port:'3306' ,
//     multipleStatements: true
//   })


// module.exports = pool;

