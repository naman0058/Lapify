var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});






router.get('/order-history',(req,res)=>{
  pool.query(`select b.*,
  (select br.name from brand br where br.id = b.brandid) as brandname,
  (select m.name from model m where m.id = b.modelid) as modelname,
  (select d.name from delivery d where d.number = b.assignednumber) as assignedname
  from booking b where b.status = 'completed' order by id desc;`,(err,result)=>{
    if(err) throw err;
    else res.render('show-orders',{result:result})
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


module.exports = router;
