var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;





router.get('/all-brand',(req,res)=>{
  pool.query(`select * from brand order by id desc  limit 5`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/all-brands',(req,res)=>{
  pool.query(`select * from brand order by name`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/all-specification',(req,res)=>{
  pool.query(`select * from specification where name = '${req.body.type}' order by id name`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.get('/all-model',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname
     from ${table} s where s.brandid = '${req.body.id}'  order by name  `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})




module.exports = router;