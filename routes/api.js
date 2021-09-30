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
  pool.query(`select * from category where type = '${req.query.type}' order by name`,(err,result)=>{
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
    (select b.name from brand b where b.id = s.brandid) as brandname,
    (select b.value from specification b where b.id = s.ram) as ramvalue,
    (select b.price from specification b where b.id = s.ram) as ramprice,
    (select b.value from specification b where b.id = s.processor) as processorvalue,
    (select b.price from specification b where b.id = s.processor) as processorprice,
    (select b.value from specification b where b.id = s.harddisk) as harddiskvalue,
    (select b.price from specification b where b.id = s.harddisk) as harddiskprice



     from model s where s.id = '${req.body.id}' `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.post('/booking-submit',(req,res)=>{
  let body = req.body
  body['status'] = 'pending'
  pool.query(`insert into booking set ?`, body , (err,result)=>{
    if(err) throw err;
    else res.json({msg:'success'})
  })
})




router.get('/get-all-booking',(req,res)=>{
  pool.query(`select b.* ,
   (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where b.status != 'completed' and b.assignednumber is null and b.transfer_status = 'sendtoll' order by id desc;`,(err,result)=>{
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



router.post('/isyear',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and isyear = 'isyear'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})



router.post('/iskeyboard',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and iskyeboard = 'iskeyboard'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})



router.post('/isscreen',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and isscreen = 'isscreen'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})



router.post('/isgraphics',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and isgraphics = 'isgraphics'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})




router.post('/ismacbook',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and ismacbook = 'ismacbook'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})




router.post('/ismacbookparts',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and ismacbookparts = 'ismacbookparts'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})







router.post('/isstorage',(req,res)=>{
  pool.query(`select id from model where id = '${req.body.modelid}' and isstorage = 'isstorage'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})




router.post('/pick_leads',(req,res)=>{
  console.log("body aayi", req.body)
  pool.query(`select * from booking where id=${req.body.id} and assignednumber is null`,(err,result)=>{
     if(err) throw err;
     else if(result[0]){

      pool.query(`select name from delivery where number = ${req.body.number}`,(err,result)=>{
        if(err) throw err;
      
        else{
          
pool.query(`select name from delivery where number = ${req.body.number} and credit > ${req.body.credit_deduct} and virtual_wallet > ${req.body.amount}`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
     
        pool.query(`update booking set assignednumber = ${req.body.number} where id= ${req.body.id}`,(err,result)=>{
          if(err) throw err;
          else {
            pool.query(`update delivery set credit = credit-${req.body.credit_deduct} , virtual_wallet = virtual_wallet - ${req.body.amount}  where number =${req.body.number}`,(err,result)=>{
            if(err) throw err;
            else {
              res.json({
                status:'200',
                description:'Picked Successfully'
              })
            }
             
 })
          }
        })
  }
  else{
    res.json({
      status : '500',
      description:"Your Wallet Credit is low..please recharge your wallte to pick leads"
    })
  }
            
})


        }
      })

     }
     else{
      res.json({
        status:"300",
        description:'Picked Already'
      })
     }
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

  body['commission_wallet'] = 0;
  body['virtual_wallet'] = 0;

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




router.get('/available-leads',(req,res)=>{
  pool.query(`select b.*,
  (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where  b.assignednumber is null and b.transfer_status = 'sendtoll' order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
  
})







router.post('/inprogress',(req,res)=>{
 pool.query(`select b.*,
  (select m.name from model m where m.id = b.modelid) as modelname
  from booking b where  b.assignednumber = '${req.body.number}' and b.status != 'completed' order by id desc`,(err,result)=>{
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
  from booking b where b.assignednumber = '${req.body.number}' and b.status = 'completed' order by id desc`,(err,result)=>{
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
  pool.query(`select * from booking where agentnumber = '${req.body.number}' and status != 'completed' order by id desc`,(err,result)=>{
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


router.post('/agent-login',(req,res)=>{
  pool.query(`select * from agent where number = '${req.body.number}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({
        msg : 'approved'
      })

    }
    else {
res.json({
  msg : 'you are not registered'
})
    }
  })
})






router.post('/update-image',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 },{ name: 'image2', maxCount: 1 },{name:'image3', maxCount:1}]),(req,res)=>{
	let body = req.body
body['status'] = 'pending'
    console.log('files data',req.files)

  body['image'] = req.files.image[0].filename
  body['image1'] = req.files.image1[0].filename
  body['image2'] = req.files.image2[0].filename
  body['image3'] = req.files.image3[0].filename
 


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





router.post('/signature',(req,res)=>{
	let body = req.body
body['status'] = 'completed'
    console.log('files data',req.body)

  // body['signature'] = req.file.filename;

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



router.post('/partner-analysis',(req,res)=>{
  var query = `select count(id) as total_booking from booking where assignednumber = '${req.body.number}';`
  var query1 = `select count(id) as today_booking from booking where assignednumber = '${req.body.number}' and date = CURDATE();`
  var query2 = `select sum(amount) as total_amount from booking where assignednumber = '${req.body.number}';`
  var query3 = `select sum(amount) as today_amount from booking where assignednumber = '${req.body.number}' and date = CURDATE();`

  pool.query(query+query1+query2+query3,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })

})




router.post('/agent-analysis',(req,res)=>{
  var query = `select count(id) as total_booking from booking where agentnumber = '${req.body.number}';`
  var query1 = `select count(id) as today_booking from booking where agentnumber = '${req.body.number}' and date = CURDATE();`
  var query2 = `select sum(amount) as total_amount from booking where agentnumber = '${req.body.number}';`
  var query3 = `select sum(amount) as today_amount from booking where agentnumber = '${req.body.number}' and date = CURDATE();`

  pool.query(query+query1+query2+query3,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })

})





router.get('/sell-desktop-category',(req,res)=>{
  pool.query(`select * from category where type= 'sell_desktop'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/model',(req,res)=>{
  pool.query(`select * from model`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


// Agent Api End



















router.get('/specification',(req,res)=>{
  pool.query(`select * from specification where name = '${req.query.type}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})











// enquiry api starts


router.get('/part/category',(req,res)=>{
  pool.query(`select * from category where type = 'sell_laptop' || type = 'sell_desktop'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})



router.get('/repair-parts',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from category b where b.id = s.brandid) as brandname
    from repair s where brandid = '${req.query.brandid}' order by name  `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.post('/enquiry-submit',(req,res)=>{
  let body = req.body;
  pool.query(`insert into parts_enquiry set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'result'})
  })
})



router.get('/myenquiry',(req,res)=>{
  var query = `select e.* ,
  (select b.name from category b where b.id = e.brandid) as brandname,
  (select p.name from repair p where p.id = e.partsid) as partsname,
  (select p.price from repair p where p.id = e.partsid) as partsprice,
  (select p.image from repair p where p.id = e.partsid) as partsimage
   from parts_enquiry e where number = '${req.query.number}' order by id desc;`
   pool.query(query,(err,result)=>{
     if(err) throw err;
     else res.json(result)
   })
})



// enquiry api ends









// bulk api starts





router.post('/bulk-submit',(req,res)=>{
  let body = req.body;
  pool.query(`insert into bulk_enquiry set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'result'})

  })
})



router.get('/bulkenquiry',(req,res)=>{
  var query = `select e.* 
   from bulk_enquiry e where number = '${req.query.number}' order by id desc;`
   pool.query(query,(err,result)=>{
     if(err) throw err;
     else res.json(result)
   })
})



// bulk api ends





// ecommerce parts api starts

    
router.get('/part/category',(req,res)=>{
  pool.query(`select * from category where type = 'sell_laptop' || type = 'sell_desktop'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.post('/get-parts',(req,res)=>{
  pool.query(`select * from parts where modelid = '${req.body.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})












router.post('/all-model-accessories',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname
     from accessories s where s.brandid = '${req.body.id}'  order by name  `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.post('/single-model-details-accessories',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname  
    from accessories s where s.id = '${req.body.id}' `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})




router.post('/isbluetooth',(req,res)=>{
  pool.query(`select id from accessories where id = '${req.body.modelid}' and isbluetooth = 'isbluetooth'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})




router.post('/iswirecut',(req,res)=>{
  pool.query(`select id from accessories where id = '${req.body.modelid}' and iswirecut = 'iswirecut'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})



router.post('/ischarger',(req,res)=>{
  pool.query(`select id from accessories where id = '${req.body.modelid}' and ischarger = 'ischarger'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})



router.post('/isappletv',(req,res)=>{
  pool.query(`select id from accessories where id = '${req.body.modelid}' and isappletv = 'isappletv'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})



router.post('/issound',(req,res)=>{
  pool.query(`select id from accessories where id = '${req.body.modelid}' and issound = 'issound'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({msg:'yes'})
    }
    else {
      res.json({msg:'no'})
    }
  })
})






// ecommerce parts api ends








router.post('/product',(req,res)=>{
  var query = `select  s.*,
               (select c.quantity from cart c where c.booking_id = s.id and c.usernumber = '${req.body.number}' and c.status is null  ) as userquantity
                 from parts s where s.modelid = '${req.body.modelid}';`
var query1 = `select sum(quantity) as counter from cart where usernumber ='${req.body.number}' and status is null;`
  var query2 = `select sum(c.price) as amount from cart c where 1 <= (select p.quantity from parts p where p.id = c.booking_id ) and  c.usernumber = '${req.body.number}' and c.status is null;;`
  
pool.query(query+query1+query2,(err,result)=>{
    if(err) throw err;
    else res.json(result)
})
})






router.post("/cart-handler", (req, res) => {
  let body = req.body
  console.log(req.body)
  if (req.body.quantity == "0" || req.body.quantity == 0) {
  pool.query(`delete from cart where booking_id = '${req.body.booking_id}' and  usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
      if (err) throw err;
      else {
        res.json({
          msg: "updated sucessfully",
        });
      }
  })
  }
  else {
      pool.query(`select oneprice from cart where booking_id = '${req.body.booking_id}' and  modelid = '${req.body.modelid}' and usernumber = '${req.body.usernumber}' and status is null`,(err,result)=>{
          if (err) throw err;
          else if (result[0]) {
             // res.json(result[0])
              pool.query(`update cart set quantity = ${req.body.quantity} , price = ${result[0].oneprice}*${req.body.quantity}  where booking_id = '${req.body.booking_id}' and modelid = '${req.body.modelid}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
                  if (err) throw err;
                  else {
                      res.json({
                        msg: "updated sucessfully",
                      });
                    }

              })
          }
          else {
            body["price"] = (req.body.price)*(req.body.quantity)
               pool.query(`insert into cart set ?`, body, (err, result) => {
               if (err) throw err;
               else {
                 res.json({
                   msg: "updated sucessfully",
                 });
               }
             });

          }

      })
  }

})






router.post("/mycart", (req, res) => {
 
  var query = `select c.*,(select s.name from parts s where s.id = c.booking_id) as servicename
  ,(select s.image from parts s where s.id = c.booking_id) as productlogo,
  (select s.quantity from parts s where s.id = c.booking_id) as productquantity
  from cart c where c.usernumber = '${req.body.usernumber}' and c.status is null;`
  var query1 = `select count(id) as counter from cart where usernumber = '${req.body.usernumber}' and status is null;`
  var query2 = `select sum(c.price) as total_ammount from cart c where c.usernumber = '${req.body.usernumber}' and c.status is null;`
  var query3 = `select c.*,(select s.name from parts s where s.id = c.booking_id) as servicename
  ,(select s.image from parts s where s.id = c.booking_id) as productlogo,
  (select s.quantity from parts s where s.id = c.booking_id) as productquantity
  from cart c where c.quantity <= (select p.quantity from parts p where p.id = c.booking_id ) and c.usernumber = '${req.body.usernumber}' and c.status is null;`
  var query4 = `select count(id) as counter from cart c where c.quantity <= (select p.quantity from parts p where p.id = c.booking_id ) and c.usernumber = '${req.body.usernumber}' and c.status is null`
  pool.query(query+query1+query2+query3+query4, (err, result) => {
    if (err) throw err;
    else if (result[0][0]) {
      req.body.mobilecounter = result[1][0].counter;
      console.log("MobileCounter", req.body.mobilecounter);
      res.json(result);
    } else
      res.json({
        msg: "empty cart",
      });
  });

});





router.post('/remove-all-data',(req,res)=>{
  pool.query(`delete from cart where usernumber = '${req.body.number}'`,(err,result)=>{
      if(err) throw err;
      else {
          res.json({
              msg : 'success'
          })
      }
  })
})





router.post('/remove-all-data-by-id',(req,res)=>{
  pool.query(`delete from cart where usernumber = '${req.body.number}' and id ='${req.body.id}'`,(err,result)=>{
      if(err) throw err;
      else {
          res.json({
              msg : 'success'
          })
      }
  })
})



router.post("/cartdelete", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select id,price,quantity from cart where id = "${req.body.id}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0].quantity > 1) {
          console.log(result[0]);
          pool.query(
            `update cart set price = price - (price/quantity) , quantity = quantity-1  where id = "${req.body.id}"`,
            (err, result) => {
              err
                ? console.log(err)
                : res.json({
                    msg: "deleted successfully",
                  });
            }
          );
        } else {
          pool.query(
            `delete from cart where id = "${req.body.id}"`,
            (err, result) => {
              err
                ? console.log(err)
                : res.json({
                    msg: "deleted successfully",
                  });
            }
          );
        }
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});



router.post("/cartupdate", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select id,price,oneprice,quantity from cart where id = "${req.body.id}"`,
      (err, result) => {
        if (err) throw err;
        else {
          console.log(result[0]);
          pool.query(
            `update cart set price = price + oneprice , quantity = quantity+1  where id = "${req.body.id}"`,
            (err, result) => {
              err
                ? console.log(err)
                : res.json({
                    msg: "updated successfully",
                  });
            }
          );
        }
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});





router.post('/get-single-product-details',(req,res)=>{
  pool.query(`select p.*, 
  (select c.quantity from cart c where c.booking_id = '${req.body.id}' and c.usernumber = '${req.body.number}' ) as userquantity
  from parts p where p.id = '${req.body.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result);
  })
})





router.post('/order-now',(req,res)=>{
  let body = req.body;
// console.log('body',req.body)
  let cartData = req.body

  console.log('CardData',cartData)



    console.log('CardData',cartData)

       body['status'] = 'pending'
        
    
      var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
      dd='0'+dd;
    } 
    
    if(mm<10) 
    {
      mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;
    
    
    body['date'] = today
    
    
    
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < 12; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
     orderid = result;
    
    
      
     console.log(req.body)



     

     pool.query(`select * from delivery where number = '${req.body.usernumber}' and virtual_wallet > '${req.body.price}'`,(err,result)=>{
         if(err) throw err;
         else if(result[0]){
           res.json({
             msg : 'You Can Not Purchase This..Your Virtual Wallet Amount is Low'
           })
          //  alert('You Can Not Purchase This..Your Virtual Wallet Amount is Low')
         }
         else {
         
          pool.query(`select * from cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
              if(err) throw err;
              else {
         
              let data = result
         
              for(i=0;i<result.length;i++){
               data[i].name = req.body.name
               data[i].date = today
               data[i].orderid = orderid
               data[i].status = 'pending'
               data[i].number = req.body.usernumber
               data[i].usernumber = req.body.usernumber
               data[i].payment_mode = 'Virtual Wallet'
               data[i].address = req.body.address
               data[i].id = null
               data[i].pincode = req.body.pincode
               data[i].order_date = today
         
         
              }
         
         
            
         
         for(i=0;i<data.length;i++) {
           console.log('quantity1',data[i].quantity)
         
         let quantity = data[i].quantity;
         let booking_id = data[i].booking_id;
         
          pool.query(`insert into partner_booking set ?`,data[i],(err,result)=>{
                  if(err) throw err;
                  else {
             
         
         pool.query(`update parts set quantity = quantity - ${quantity} where id = '${booking_id}'`,(err,result)=>{
          if(err) throw err;
          else {
         
          }
         
         })
         
                  }
             })
         }
         
         
         
         pool.query(`delete from cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
           if(err) throw err;
           else {

            pool.query(`update delivery set virtual_wallet = virtual_wallet-${req.body.price} where number = '${req.body.usernumber}'`,(err,result)=>{
              if(err) throw err;
              else{
            res.json({
               msg : 'success'
             })
              }
            })
            
           }
         })
         
         
              }
          })
         }

        
     })
    
    
     

  

 
})




router.post('/myorders',(req,res)=>{
	pool.query(`select p.* ,
  (Select b.name from parts b where b.id = p.booking_id) as bookingname
  from partner_booking p where p.number = '${req.body.number}' order by id desc `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})




router.post('/update-partner-booking', (req, res) => {
  pool.query(`update partner_booking set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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

module.exports = router;