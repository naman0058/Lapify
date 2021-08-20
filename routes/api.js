var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");








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
  body['status'] = 'pending'
  body['assignednumber'] = '7503747377'
  pool.query(`insert into booking set ?`, body , (err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})




router.get('/get-all-booking',(req,res)=>{
  pool.query(`select b.* ,
   (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where b.status != 'completed' and b.assignednumber is null and b.transfer_status = 'yes' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})










router.post('/mybooking',(req,res)=>{
  pool.query(`select b.* , 
  (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where b.number = '${req.body.number}' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})

















router.get('/get-faq',(req,res)=>{
  pool.query(`select * from faq order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/get-faq/delete',(req,res)=>{
  pool.query(`delete from faq where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/update-faq', (req, res) => {
  pool.query(`update faq set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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





router.get('/all-website-customize',(req,res)=>{
  pool.query(`select * from website_customize`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})








router.get('/get-faq/website',(req,res)=>{
  pool.query(`delete from website_customize where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/update-website', (req, res) => {
  pool.query(`update website_customize set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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
  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
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






















// Partner Api Start //

router.post('/partner-registeration',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 },{ name: 'image2', maxCount: 1 }]),(req,res)=>{
	let body = req.body
body['status'] = 'pending'
    console.log('files data',req.files)

    
if(req.files.image[0]){
  body['image'] = req.files.image[0].filename

}

  
if(req.files.image1){
    body['image1'] = req.files.image1[0].filename
  }

  
if(req.files.image2){
    body['image2'] = req.files.image2[0].filename
  }

console.log('body hai',req.body)



pool.query(`select * from delivery where number = '${req.body.number}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
   res.json({
     status : 500,
     type:'already regiestered',
     description : 'registered already'
   })
  }
  else{
    pool.query(`insert into delivery set ?`,body,(err,result)=>{
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
                  description:'successfully added'
              })
          }
    })
  }
})

   

})



router.post('/partner-login',(req,res)=>{
  pool.query(`select * from delivery where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      
if(result[0].status == 'approved'){
res.json({
  msg : 'approved'
})
}
else {
  res.json({
    msg : 'pending'
  })
}

    }
    else {
res.json({
  msg : 'you are not registered'
})
    }
  })
})


router.post('/today-booking',(req,res)=>{
 pool.query(`select b.*,
  (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where  b.assignednumber = '${req.body.number}' and b.status != 'completed' and date = CURDATE() order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/tommorow-booking',(req,res)=>{
  pool.query(`select b.*,
   (select m.name from model m where m.id = b.modelid) as modelname
   from booking b where  b.assignednumber = '${req.body.number}' and b.status != 'completed' and date = CURDATE() + INTERVAL 1 DAY order by id desc`,(err,result)=>{
     if(err) throw err;
     else res.json(result)
   })
 })


 router.post('/hold-booking',(req,res)=>{
  pool.query(`select b.*,
   (select m.name from model m where m.id = b.modelid) as modelname
   from booking b where  b.assignednumber = '${req.body.number}' and b.status = 'hold' order by id desc`,(err,result)=>{
     if(err) throw err;
     else res.json(result)
   })
 })


 router.post('/partner-history',(req,res)=>{
  pool.query(`select b.* ,
  (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where b.assignednumber = '${req.body.number}' and b.status = 'completed' oreder by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/get-single-booking',(req,res)=>{
  pool.query(`select b.* ,
  (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where b.id = '${req.body.id}'`,(err,result)=>{
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


router.get('/enquiry',(req,res)=>{
  pool.query(`select * from enquiry where status!='completed' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/enquiry-history',(req,res)=>{
  pool.query(`select * from enquiry where status ='completed' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})

// Partner Api Ends //




// Agent Api Start //

router.post('/add-agent',(req,res)=>{
  let body = req.body;
  pool.query(`insert into agent set ?`,body , (err,result)=>{
    if(err) throw err;
    else res.json({msg : 'success'})
  })
})


router.get('/get-all-agent',(req,res)=>{
  pool.query(`select * from agent where partnernumber = '${req.query.number}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/live-agent-booking',(req,res)=>{
  pool.query(`select * from booking where agentnumber = '${req.body.number}' and status != 'completed'`,(err,result)=>{
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







// Agent Api End




module.exports = router;