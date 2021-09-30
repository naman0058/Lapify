var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'pincode';
const fs = require("fs");



router.get('/',(req,res)=>{
    if(req.session.adminid){
        res.render('pincode')
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})


router.post('/storeEditId',(req,res)=>{
    req.session.editStoreId = req.body.id
    res.send('success')
})


router.post('/insert',(req,res)=>{
	let body = req.body
    
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
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
})



router.get('/all',(req,res)=>{
	pool.query(`select * from ${table} `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.get('/delete', (req, res) => {
    let body = req.body
    pool.query(`delete from ${table} where id = ${req.query.id}`, (err, result) => {
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
                description:'successfully delete'
            })
        }
    })
})


router.post('/update', (req, res) => {
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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







router.post('/update_image',upload.single('image'), (req, res) => {
    let body = req.body;
    body['image'] = req.file.filename


    pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
        if(err) throw err;
        else {
            fs.unlinkSync(`public/images/${result[0].image}`); 


 pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            // res.json({
            //     status:200,
            //     type : 'success',
            //     description:'successfully update'
            // })

            res.redirect('/category')
        }
    })


        }
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



       

       pool.query(`select * from delivery where number = '${req.body.usernumber}' where virtual_wallet > '${req.body.amount}'`,(err,result)=>{
           if(err) throw err;
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
               res.json({
                 msg : 'success'
               })
             }
           })
           
           
                }
            })
           }

          
       })
      
      
       
  
    
  
   
  })



module.exports = router;