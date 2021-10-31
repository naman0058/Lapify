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
    else res.render('show_brand', { title: 'Express',result:result ,type:'laptop'});
  })
  // res.render('index', { title: 'Express' });
});



router.get('/sell-old-desktop', function(req, res, next) {
  var query = `select * from category where type = 'sell_desktop' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result ,type:'desktop'});
  })
  // res.render('index', { title: 'Express' });
});



router.get('/sell-old-accessories', function(req, res, next) {
  var query = `select * from category where type = 'sell_accessories' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result ,type:'accessories'});
  })
  // res.render('index', { title: 'Express' });
});


router.get('/enquiry', function(req, res, next) {
  var query = `select * from category where type = 'sell_laptop' || type = 'sell_desktop' order by name ;`
  pool.query(query,(err,result)=>{
    if(err) throw err;
    else res.render('show_brand', { title: 'Express',result:result , type:'enquiry'});
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
  req.session.switchon = req.query.switchon
  // console.log(req.query)
  pool.query(`select m.name , m.image , m.processor , m.harddisk , m.ram ,
  (select s.value from specification s where s.id = m.ram) as ramvalue,
  (select s.value from specification s where s.id = m.processor) as processorvalue,
  (select s.value from specification s where s.id = m.harddisk) as harddiskvalue
  
  from model m where id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    // else res.json(result)
     else res.render('configuration',{result:result,switchon:req.session.switchon})
  })
})



router.post('/configuration/set',(req,res)=>{
  let body = req.body
  req.session.ram = req.body.ram
  req.session.processor = req.body.processor
  req.session.harddisk = req.body.harddisk
  res.send('success')
})


router.get('/additional_features',(req,res)=>{
  
  pool.query(`select m.name , m.image,
  (select s.value from specification s where s.id = '${req.session.ram}') as ramvalue,
  (select s.value from specification s where s.id = '${req.session.processor}') as processorvalue,
  (select s.value from specification s where s.id = '${req.session.harddisk}') as harddiskvalue
  from model m where m.id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('additional_features',{result:result,switchon:req.session.switchon})
  })
})



router.post('/additional_features/set',(req,res)=>{
  let body = req.body;
  req.session.screen_size = req.body.a;
  req.session.graphics_card = req.body.b;
  res.send('success')

})




router.get('/issues',(req,res)=>{
  pool.query(`select m.name , m.image,
  (select s.value from specification s where s.id = '${req.session.ram}') as ramvalue,
  (select s.value from specification s where s.id = '${req.session.processor}') as processorvalue,
  (select s.value from specification s where s.id = '${req.session.harddisk}') as harddiskvalue
  from model m where m.id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('issues',{
      result:result,switchon:req.session.switchon,
      screen_size : req.session.screen_size ,  graphics_card : req.session.graphics_card

    })
  })
})


router.post('/issue/set',(req,res)=>{
  let body = req.body;
  let c = JSON.parse(req.body.b)
  req.session.issue = c;
  console.log('c',req.session.issue)
  res.send('success')
})



router.get('/age',(req,res)=>{
  pool.query(`select m.name , m.image,
  (select s.value from specification s where s.id = '${req.session.ram}') as ramvalue,
  (select s.value from specification s where s.id = '${req.session.processor}') as processorvalue,
  (select s.value from specification s where s.id = '${req.session.harddisk}') as harddiskvalue
  from model m where m.id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('age',{
      result:result,switchon:req.session.switchon,
      screen_size : req.session.screen_size ,  graphics_card : req.session.graphics_card , issue : req.session.issue

    })
    //  res.json(req.session.issue)

  })
})


router.get('/physical_condition',(req,res)=>{
  req.session.age = req.query.age
  pool.query(`select m.name , m.image,
  (select s.value from specification s where s.id = '${req.session.ram}') as ramvalue,
  (select s.value from specification s where s.id = '${req.session.processor}') as processorvalue,
  (select s.value from specification s where s.id = '${req.session.harddisk}') as harddiskvalue
  from model m where m.id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('physical_condition',{
      result:result,switchon:req.session.switchon,
      screen_size : req.session.screen_size ,  graphics_card : req.session.graphics_card ,
      issue : req.session.issue , age : req.session.age

    })
  })
})



router.get('/quote-page',(req,res)=>{
  req.session.condition = req.query.condition
  pool.query(`select m.name , m.image,
  (select s.value from specification s where s.id = '${req.session.ram}') as ramvalue,
  (select s.value from specification s where s.id = '${req.session.processor}') as processorvalue,
  (select s.value from specification s where s.id = '${req.session.harddisk}') as harddiskvalue
  from model m where m.id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('quote_page',{
      result:result,switchon:req.session.switchon,
      screen_size : req.session.screen_size ,  graphics_card : req.session.graphics_card ,
      issue : req.session.issue , age : req.session.age , condition : req.session.condition

    })
  })
  
})




router.get('/checkout',(req,res)=>{
  pool.query(`select m.name , m.image,
  (select s.value from specification s where s.id = '${req.session.ram}') as ramvalue,
  (select s.value from specification s where s.id = '${req.session.processor}') as processorvalue,
  (select s.value from specification s where s.id = '${req.session.harddisk}') as harddiskvalue
  from model m where m.id = '${req.session.modelid}'`,(err,result)=>{
    if(err) throw err;
    else res.render('checkout',{
      result:result,switchon:req.session.switchon,
      screen_size : req.session.screen_size ,  graphics_card : req.session.graphics_card ,
      issue : req.session.issue , age : req.session.age , condition : req.session.condition

    })
  })
})


router.get('/enquiry/:name/:id',(req,res)=>{
   req.session.enquirybrandid = req.params.id
	pool.query(`select s.* , 
    (select b.name from category b where b.id = s.brandid) as brandname
    from repair s where brandid = '${req.params.id}' order by name  `,(err,result)=>{
		if(err) throw err;
        // else res.json(result)
        else res.render('enquries',{result:result})
	})
})


router.post('/enquiry-submit',(req,res)=>{
  let body = req.body;
  body['brandid'] = req.session.enquirybrandid
  console.log('body h',body)
  pool.query(`insert into parts_enquiry set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.json({msg:'result'})
  })
})


router.get('/accessories/:name/:id',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname
     from accessories s where s.brandid = '${req.params.id}'  order by name  `,(err,result)=>{
		if(err) throw err;
    else res.render('show_model_accessories',{result:result,type:'accessories'})

	})
})



router.get('/accessories/model/:name/:id',(req,res)=>{
	pool.query(`select s.* , 
    (select b.name from brand b where b.id = s.brandid) as brandname  
    from accessories s where s.id = '${req.params.id}' `,(err,result)=>{
		if(err) throw err;
    else res.render('single_model_accessories',{result:result})

	})
})


router.get('/accessories/switchon/:name/:id',(req,res)=>{
  req.session.modelid = req.params.id
  pool.query(`select * from accessories where id = '${req.params.id}'`,(err,result)=>{
    if(err) throw err;
    //else res.json(result)
     else res.render('Accessories/switchon',{result:result})
  })
})



router.get('/accessories/age/:name/:id',(req,res)=>{
  let body = req.query
  console.log('dgfg',req.query)
  req.session.device_not_work_properly = req.query.device_not_work_properly
  req.session.lan_port = req.query.lan_port
  req.session.hdmi_port = req.query.hdmi_port
  pool.query(`select * from accessories where id = '${req.params.id}'`,(err,result)=>{
    if(err) throw err;
    //else res.json(result)
     else res.render('Accessories/age',{result:result,switchon:req.query.device_not_work_properly,
                      lan_port:req.query.lan_port , hdmi_port : req.query.hdmi_port})
  })
})

// router.get('/enquiry/form/submit',(req,res)=>{
//   res.render('enquiry_submit')
// })


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
