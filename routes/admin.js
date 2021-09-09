var express = require('express');

var router = express.Router();
var pool = require('./pool')
var table = 'admin';
const request = require('request');


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd; 


router.get('/',(req,res)=>{
    res.render('admin_login',{msg : ''})
})


router.get('/logout',(req,res)=>{
    req.session.adminid = null;
    res.redirect('/admin')
})


router.get('/change-password',(req,res)=>{

var otp = Math.floor(Math.random()*100000)+1;

    request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=8319339945&message=Use OTP ${otp} to change password your DailyNourish Account.&format=json`, { json: true }, (err, result) => {
        if (err) { return console.log(err); }
       else {
           req.session.otp = otp
        res.render('change-password',{msg:''})
       }
    })
   
})




router.post('/change-password',(req,res)=>{

    if(req.session.otp == req.body.otp){
 pool.query(`update admin set password = '${req.body.password}'`,(err,result)=>{
     if(err) throw err;
     else res.render('admin_login',{msg:''})
 })
    }
    else {
        res.render('change-password',{msg:'Invalid OTP'})
    }
       
    })

router.post('/login',(req,res)=>{
    pool.query(`select * from ${table} where email = '${req.body.email}' and password = '${req.body.password}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
          req.session.adminid = result[0].id
          res.redirect('/admin/dashboard')
        }
        else {
            res.render('admin_login',{msg : 'Invalid Username & Password'})
        }
    })
})


router.get('/dashboard',(req,res)=>{
    if(req.session.adminid){
    var query = `select count(id) as total from category;`
    var query2 = `select count(id) as total from model;`
    var query3 =  `select count(id) as total from users;`
    var query4 = `select count(id) as total from booking where status != 'completed';`
    var query5 = `select count(id) as total from booking where status = 'completed';`
    var query6 = `select count(id) as total from booking;`
    var query7 = `select sum(amount) as total from booking;`
    var query8 = `select sum(amount) as total from booking where date = '${today}';`
    var query9 = `select * from booking order by id desc;`
    pool.query(query+query2+query3+query4+query5+query6+query7+query8+query9,(err,result)=>{
if(err) throw err;
else res.render('dashboard',{result:result})
    })
     
    }
    else {
        res.render('admin_login',{msg : 'Please Login'})
    }
})







router.get('/approved-vendor',(req,res)=>{
    if(req.session.adminid){
        pool.query(`select * from delivery where status =  'approved' order by id desc`,(err,result)=>{
            if(err) throw err;
            else res.render('approved-vendor',{result})
        })
    }
    else {
        res.redirect('/admin')
    }
   
})


router.get('/requested-vendor',(req,res)=>{
    if(req.session.adminid){

        pool.query(`select * from delivery where status !=  'approved' order by id desc`,(err,result)=>{
            if(err) throw err;
            else res.render('requested-vendor',{result})
        })
    }
    else{
        res.redirect('/admin')
    }
 
})



router.get('/approved',(req,res)=>{
    pool.query(`update delivery set status = 'approved' where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/requested-vendor')
    })
})


router.get('/reject',(req,res)=>{
    pool.query(`delete from delivery where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/requested-vendor')
    })
})





router.get('/history',(req,res)=>{
    pool.query(`select b.*,
    (select br.name from brand br where br.id = b.brandid) as brandname,
    (select m.name from model m where m.id = b.modelid) as modelname,
    (select p.name from parts p where p.id = b.partid) as partname
    from enquiry b where b.status = 'completed' order by id desc;`,(err,result)=>{
      if(err) throw err;
      else res.render('show-enquiry',{result:result})
    })
  })
  
  
  router.get('/running-enquiry',(req,res)=>{
    pool.query(`select b.* , 
    (select br.name from brand br where br.id = b.brandid) as brandname,
    (select m.name from model m where m.id = b.modelid) as modelname,
    (select p.name from parts p where p.id = b.partid) as partname
    from enquiry b where b.status != 'completed' order by id desc;`,(err,result)=>{
      if(err) throw err;
      else res.render('show-enquiry',{result:result})
    })
  })




  router.get('/vendor/agent',(req,res)=>{
      pool.query(`select * from agent where partnernumber = '${req.query.number}'`,(err,result)=>{
          if(err) throw err;
          else res.render('agent-list',{result})
      })
  })




  router.get('/vendor/enquiry',(req,res)=>{
    pool.query(`select * from booking where assignednumber = '${req.query.number}'`,(err,result)=>{
        if(err) throw err;
        else res.render('show-vendor-orders',{result})
    })
})


router.get('/agent-list',(req,res)=>{
    pool.query(`select a.* , (select d.name from delivery d where d.number = a.partnernumber) as partnername from agent a order by id desc;`,(err,result)=>{
        if(err) throw err;
        else res.render('agent-list-complete',{result})
    })
})


router.get('/update/agent',(req,res)=>{
    pool.query(`update agent set status = '${req.query.status}' where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/agent-list')
    })
})


router.get('/update/vendor',(req,res)=>{
    pool.query(`update delivery set blockstatus = '${req.query.status}' where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/approved-vendor')
    })
})


router.get('/vendor/personal-details',(req,res)=>{
    pool.query(`select * from delivery where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.render('vendor-details-edit',{result:result})
    })
})





router.post('/vendor/update-profile', (req, res) => {
    pool.query(`update delivery set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
           res.redirect(`/admin/vendor/personal-details?id=${req.body.id}`)

            
        }
    })
})

module.exports = router;
