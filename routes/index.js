var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = `select * from category where type = 'sell_laptop' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('index', { title: 'Express',result:result });
  })
  // res.render('index', { title: 'Express' });
});





router.get('/sell-old-laptop', function(req, res, next) {
  var query = `select * from category where type = 'sell_laptop' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result });
  })
  // res.render('index', { title: 'Express' });
});



router.get('/sell-old-desktop', function(req, res, next) {
  var query = `select * from category where type = 'sell_desktop' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result });
  })
  // res.render('index', { title: 'Express' });
});



router.get('/sell-old-accessories', function(req, res, next) {
  var query = `select * from category where type = 'sell_accessories' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result });
  })
  // res.render('index', { title: 'Express' });
});


router.get('/enquiry', function(req, res, next) {
  var query = `select * from category where type = 'sell_laptop' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result });
  })
  // res.render('index', { title: 'Express' });
});




router.get('/brand/:name/:id',(req,res)=>{
  pool.query(`select s.* , 
  (select b.name from brand b where b.id = s.brandid) as brandname
   from model s where s.brandid = '${req.params.id}'  order by name  `,(err,result)=>{
  if(err) throw err;
      else res.render('show_model',{result:result})
})
})



router.get('/model/:name/:id',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname,
    (select b.value from specification b where b.id = s.ram) as ramvalue,
    (select b.price from specification b where b.id = s.ram) as ramprice,
    (select b.value from specification b where b.id = s.processor) as processorvalue,
    (select b.price from specification b where b.id = s.processor) as processorprice,
    (select b.value from specification b where b.id = s.harddisk) as harddiskvalue,
    (select b.price from specification b where b.id = s.harddisk) as harddiskprice
     from model s where s.id = '${req.params.id}' `,(err,result)=>{
		if(err) throw err;
    // else res.json(result)
         else res.render('single_model',{result:result})
	})
})





router.get('/order-history',(req,res)=>{
  pool.query(`select b.*,
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from booking b where b.status = 'completed' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders-history',{result:result})
  })
})


router.get('/running-order',(req,res)=>{
  pool.query(`select b.* , 
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from booking b where b.status != 'completed' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders',{result:result})
  })
})


router.get('/cancel-order',(req,res)=>{
  pool.query(`select b.* , 
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from cancel_booking b order by id desc `,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders',{result:result})
  })
})











router.get('/parts/order-history',(req,res)=>{
  pool.query(`select b.*,
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from booking b where b.status = 'completed' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders',{result:result})
  })
})


router.get('/parts/running-order',(req,res)=>{
  pool.query(`select b.* , 
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from booking b where b.status != 'completed' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders',{result:result})
  })
})


router.get('/parts/cancel-order',(req,res)=>{
  pool.query(`select b.* , 
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from cancel_booking b order by id desc `,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders',{result:result})
  })
})




router.get('/purchase-report',(req,res)=>{
  pool.query(`select * from cancel_booking order by id desc `,(err,result)=>{
    if(err) throw err;
    else res.render('purchase-report',{result:result})
  })
})


router.get('/sales-report',(req,res)=>{
  pool.query(`select * from booking order by id desc `,(err,result)=>{
    if(err) throw err;
    else res.render('sales-report',{result:result})
  })
})


router.get('/stock-report',(req,res)=>{
  pool.query(`select p.* , (select c.name from category c where c.id = p.categoryid) as categoryname from product p order by quantity `,(err,result)=>{
    if(err) throw err;
    else res.render('sales-report',{result:result})
  })
})


router.post('/booking/update',(req,res)=>{
  console.log(req.body)
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






router.get('/website-customization',(req,res)=>{
  res.render('website_customization')
})



router.get('/faq-customization',(req,res)=>{
  res.render('faq_customization')
})




router.post('/faq-insert',(req,res)=>{
  let body = req.body
  pool.query(`insert into faq set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({
      msg : 'success'
    })
  })
})



router.post('/website-customization-insert',(req,res)=>{
  let body = req.body   
  pool.query(`select * from website_customize where name = '${req.body.name}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({
        msg : 'Already Inserted'
      })
    }
    else {
      pool.query(`insert into website_customize set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
          msg : 'success'
        })
      })
    }
  })
})




router.get('/bulkenquiry/all',(req,res)=>{
  var query = `select e.* 
   from bulk_enquiry e order by id desc;`
   pool.query(query,(err,result)=>{
     if(err) throw err;
     else res.render('bulk-enquiry',{result:result})

   })
})




router.get('/switchon/:name/:id',(req,res)=>{
  req.session.modelid = req.params.id
  pool.query(`select name , image from model where id = '${req.params.id}'`,(err,result)=>{
    if(err) throw err;
    else res.render('switchon',{result:result})
  })
 
})



router.get('/configuration',(req,res)=>{
  pool.query(`select name , image from model where id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('configuration',{result:result})
  })
})



router.get('/additional_features',(req,res)=>{
  pool.query(`select name , image from model where id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('additional_features',{result:result})
  })
})






// CustomNumber
// amount




// router.post('/get_recharge',(req,res)=>{
//   let body = req.body;
//   pool.query(`select * from users where mobile = '${req.body.mobile}' and (type = 'Retailer' || type = 'Distributor') and status = 'Active' and main_balance > '${req.body.amount}'`,(err,result)=>{
//       if(err) throw err;
//       else if(result[0]){
//        pool.query(`select * from transactions where customer_no = '${req.body.number}' and amount = '${req.body.amount}' and status = 'success' and time query`,(err,result)=>{
//            if(err) throw err;
//            else if(result[0]){
//             res.json({msg:'Duplicate Transaction'})
//            }
//            else{
//         pool.query(`insert into transaction set ?`,body,(err,result)=>{
//             if(err) throw err;
//             else {
//                 pool.query(`update users set main_balance = main_balance - '${req.body.amount}' where mobile = '${req.body.mobile}'`,(err,result)=>{
//                     if(err) throw err;
//                     else {
//                         // calling api here...
//                     }
//                 })
//             }
//         })

//            }
//        })
//       }
//       else{
//           res.json({msg:'Invalid Number or Balance Low'})
//       }
//   })
// })



// router.post('/ussd_recharge',(req,res)=>{
//   let body = req.body;
//   console.log(req.body)
//   // res.json({response : body})

// //code checking for balance 
// if(req.body.reqText == '*370*1#'){


//   pool.query(`select main_balance from users where mobile = '${req.body.msisdn}' and status = 'active'`,(err,result)=>{
//     if(err) throw err;
//     else if(result[0]){
//       res.json(result)
//     }
//     else{
//      res.json({msg : 'You are not active or not registered'})
//     }
//   })

// }


// // reqtext
// else if(req.body.reqText == '*370*{9}*{4}#'){

//   receivernumber=9;
//   70 or 71 -> Awc_recharge()
//   79 or 73 -> Roshan_recharge()
//   78 -> etisatlat_recharge()
//   74 -> salaam_recharge()
//   72 -> mtn recharge()
//   amount=4;

// }
// //Transfering amount from one top client ot the down client
// else if(req.body.reqText == '*370*code*amount#'){

//   //check if active or not
//   //check if user has enough amount - > main_balance -> user_type condition
//   // duplicate condition -> same time & same amount ->(fund_transfer table)
//   // sender deduct and receiver add 
//   // fund_transfer table insert data
//   //success or failed return
//   //sms send -> your amount 400 inr has transfered successfuly to code number.
//   //response to the screen 

// }



// })



module.exports = router;
