var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");



router.get('/wallet-transaction',(req,res)=>{
    if(req.session.adminid){
        pool.query(`select t.* , (select v.name from delivery v where v.number = t.number ) as vendorname from transaction t where t.type = 'wallet_transaction'`,(err,result)=>{
            if(err) throw err;
            else res.render('wallet_transaction',{result})
        })
        
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})



router.get('/virtual-wallet-transaction',(req,res)=>{
    if(req.session.adminid){
        pool.query(`select t.* , (select v.name from delivery v where v.number = t.number ) as vendorname from transaction t where t.type = 'virtual_wallet_transaction' order by id desc limit 50`,(err,result)=>{
            if(err) throw err;
            else res.render('wallet_transaction',{result})
        })
        
    }
    else {
        res.render('admin_login',{msg:'Please Login First'})
    }
  // res.render('category')
    
})




router.get('/date-wise',(req,res)=>{
    if(req.session.adminid) {
     res.render('date-wise')
    }
    else{
        res.render('admin_login',{msg:'Please Login First'})

    }
})





router.get('/search-by-person',(req,res)=>{
    if(req.session.adminid) {
     res.render('search-by-person')
    }
    else{
        res.render('admin_login',{msg:'Please Login First'})

    }
})




router.get('/reports/bytype',(req,res)=>{
    console.log(req.query)
    var query = `select sum(amount) as total_amount from transaction t where date between '${req.query.from_date}' and '${req.query.to_date}' and t.type = '${req.query.type}' and sign = '+';`
    var query1 = `select t.* , (select u.name from users u where u.number = t.number) as username from transaction t where date between '${req.query.from_date}' and '${req.query.to_date}' and t.type = '${req.query.type}' order by id desc;`
    var query2 = `select sum(amount) as total_amount from transaction t where date between '${req.query.from_date}' and '${req.query.to_date}' and t.type = '${req.query.type}' and sign = '-';`
    
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
     //    00else res.render('Admin/transaction-talent-hunt',{result})
 else res.json(result)  
 })
})





router.get('/reports/bynumber',(req,res)=>{
    console.log(req.query)
    var query = `select sum(amount) as total_amount from transaction t where  t.type = '${req.query.type}' and sign = '+' and number = '${req.query.number}';`
    var query1 = `select t.* , (select u.name from users u where u.number = t.number) as username from transaction t where  t.type = '${req.query.type}' and number = '${req.query.number}' order by id desc;`
    var query2 = `select sum(amount) as total_amount from transaction t where t.type = '${req.query.type}' and sign = '-' and number = '${req.query.number}';`
    
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
     //    00else res.render('Admin/transaction-talent-hunt',{result})
 else res.json(result)  
 })
})



module.exports = router;