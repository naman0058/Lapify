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




router.post('/specification',(req,res)=>{
  pool.query(`select * from specification where name = '${req.body.type}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/all-model',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname
     from model s where s.brandid = '${req.body.id}'  order by name  `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})




router.post('/single-model-details',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname
     from model s where s.id = '${req.body.id}' `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.post('/booking-submit',(req,res)=>{
  let body = req.body
  pool.query(`insert into booking set ?`, body , (err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})




router.get('/get-all-booking',(req,res)=>{
  pool.query(`select * from booking where status != 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})





router.post('/get-single-booking',(req,res)=>{
  pool.query(`select * from booking where id = '${req.body.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/mybooking',(req,res)=>{
  pool.query(`select * from booking where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/live-partner-booking',(req,res)=>{
  pool.query(`select * from booking where assignednumber = '${req.body.number}' and status! = 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/partner-history',(req,res)=>{
  pool.query(`select * from booking where assignednumber = '${req.body.number}' and status = 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/add-agent',(req,res)=>{
  let body = req.body;
  pool.query(`insert into agent set ?`,body , (err,result)=>{
    if(err) throw err;
    else res.json({msg : 'success'})
  })
})


router.get('/get-all-agent',(req,res)=>{
  pool.query(`select * from ageant where partnernumber = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/live-agent-booking',(req,res)=>{
  pool.query(`select * from booking where agentnumber = '${req.body.number}' and status! = 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/agent-history',(req,res)=>{
  pool.query(`select * from booking where agentnumber = '${req.body.number}' and status = 'completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/update-booking', (req, res) => {
  pool.query(`update booking set ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) {
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else {
          res.json({
              status:200,
              type : 'success',
              description:'successfully update'
          })

          
      }
  })
})






router.get('/get-address',(req,res)=>{
  pool.query(`select * from address where usernumber = '${req.query.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})



router.post('/save-address',(req,res)=>{
  let body = req.body;
  console.log('body h',req.body)
  pool.query(`insert into address set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.json({
          msg : 'success'
      })
  })
})




router.get('/delete-address',(req,res)=>{
  pool.query(`delete from address where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})



router.get('/get-single-address',(req,res)=>{
  pool.query(`select * from address where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/update-address', (req, res) => {
  console.log('data',req.body)
  pool.query(`update address set ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) {
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else {
          res.json({
              status:200,
              type : 'success',
              description:'successfully update'
          })

          
      }
  })
})










router.post('/save-user',(req,res)=>{
  let body = req .body
  body['date'] = today
    pool.query(`select * from users where number  = '${req.body.number}'`,(err,result)=>{
      if(err) {
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else if(result[0]) {
        res.json({
            status : 100,
            type:'success',
            description:'successfully registered'

        })
      }
      else{
       pool.query(`insert into users set ?`,body,(err,result)=>{
           if(err) {
              res.json({
                  status:500,
                  type : 'error',
                  description:err
              })
           }
           else {
              res.json({
                  status:200,
                  type : 'success',
                  description:'successfully registered'
              })
           }
       })
      }
  })
     

})





router.get('/get-top-banner',(req,res)=>{
  pool.query(`select * from banner where type = 'Front Banner'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/get-bottom-banner',(req,res)=>{
  pool.query(`select * from banner where type = 'Bottom Banner'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




module.exports = router;