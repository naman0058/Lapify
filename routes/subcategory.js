var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'model';


router.get('/',(req,res)=>{
    if(req.session.adminid){
    res.render('subcategory')
    }
    else{
        res.render('admin_login',{msg:'Please Login First'})
    }
})


router.post('/insert',upload.single('image'),(req,res)=>{
	let body = req.body
    console.log(req.body)
    body['image'] = req.file.filename;
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
		if(err) {
            console.log(err)
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
	pool.query(`select s.* , 
    (select b.name from category b where b.id = s.brandid) as brandname,
    (select b.value from specification b where b.id = s.ram) as ramname,
    (select b.value from specification b where b.id = s.processor) as processorname,
    (select b.value from specification b where b.id = s.harddisk) as harddiskname

     from ${table} s order by name  `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
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
            console.log(err)
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
            res.redirect('/model')
        }
    })
})











router.post('/get_recharge',(req,res)=>{
    let body = req.body;
    var query = `SELECT id,name,contact_name,type,main_balance,balance,deleted_at,status FROM users WHERE deleted_at IS NULL AND (mobile='${req.body.mobile}' || contact_no='${req.body.mobile}' || pincode='${req.body.mobile}') and (type = 'Retailer' || type = 'Distributor') and status = 'Active' and main_balance > '${req.body.amount}';`
    var query1 = `SELECT trn_date,name,amount,status FROM transactions  WHERE  customer_no='${req.body.recmobile}' AND amount='${req.body.amount}' AND status='Success'  ORDER BY id DESC LIMIT 1;`
    var query3 = `select krenege`
    pool.query(query+query1,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]){
           let mydata = result[0][0]
           let c_name = result[0][0].contact_name;
           let leftamt = result[0][0].main_balance-body.amount; 
            if(result[2][0]){
               res.json({status:14,message:'Duplicate Transaction'})
            }
            else{

   body['uid'] = result[0][0].id;
   body['name'] = name;
   body['service']  = 'Test';
   body['provider'] = 'USername';
   body['status'] = 'pending';
   body['source'] = 'USSD';

   pool.query(`insert into transactions set ?`,body,(err,result)=>{
       if(err) throw err;
       else {
           let deductamount = data.main_balance - req.body.amount;
           pool.query(`INSERT INTO remisiers(uid,opening_balance,type,amount,closing_balance,module,remarks,trn_no,created_at,updated_at) values("${req.body.uid}","${data.main_balance}",'Dr','${req.body.amount}','${deductamount}','Recharge','test','${body.tran_id}','".DATE('Y-m-d H:i:s')."','".DATE('Y-m-d H:i:s')."')`,(err,result)=>{
               if(err) throw err;
               else {
                $RequestUniqueID = date("YmdHis").rand(1000, 9999); 
                let p_code ="P_4B8E30V";

                let api_url = "http://api.";   // API URL
                let enc_key = base64_decode("unvivhEmFgvQci");  // API Encryption Key
                let sign_key = base64_decode("1l/WN"); // API Sign Key

                //Plain text request
                let recee= "0$recmobile";
                let plaintext = {
                    $RequestUniqueID,
                    ProductCode:p_code,
                    TxReference:recee,
                    Amount: body.amount,
                    MPin : 78787,
                    Email:'',
                    ANI:'',
                    MethodName:'',
                    RequestIP:'127.0.0.1'
                    
                }
                
                
                let enc_data = encrypt($plaintext, $enc_key, $sign_key);   // Encrypt Request Data
                

         
                let post_data = 'ActivationCode=6917010&Data=' + enc_data; // Post Data

                pool.query(`UPDATE transactions SET recharge_request='${plaintext}"' WHERE id='${recid}"`,(err,result)=>{
                     if(err) throw err;
                     else {
                        callAPI(api_url, post_data,(err,result)=>{
                            if(err) throw err;
                            else if(result[0].status == 1){
                                pool.query(`UPDATE transactions SET status='Success',opr_id='3',recharge_responce='${result[0]}' WHERE id='${recid}'`,(err,result)=>{
                                    if(err) throw err;
                                    else {
                                        res.json({status:1,mobile:body.mobile,amount:body.amount,recmobile:body.recmobile,leftamt,c_name})
                                    }
                                })
                            }
                            else{
                               pool.query(`SELECT id,main_balance,balance FROM users WHERE mobile='${body.mobile}' OR contact_no='${body.mobile}'`,(err,result)=>{
                                   if(err) throw err;
                                   else {
                                    let salaamadd = result[0].main_balance+ body.amount;
                                    pool.query(`UPDATE transactions SET status='Failed',recharge_responce='${resjan}' WHERE id='${recid}'`,(err,result)=>{
                                        if(err) throw err;
                                        else {
                                            pool.query(`INSERT INTO remisiers(uid,opening_balance,type,amount,closing_balance,module,remarks,trn_no,created_at,updated_at) values("${result[0].id}","${result[0].main_balance}",'Cr','${body.amount}','${salaamadd}','Recharge Failed','test','".$tran_id."','".DATE('Y-m-d H:i:s')."','".DATE('Y-m-d H:i:s')."')`,(err,result)=>{
                                                if(err) throw err;
                                                else {
                                                    res.json({status:0,mobile:body.mobile})
                                                }
                                            })
                                        }
                                    })
                                   }
                               })
                            }
                        })

                     }
                })
                
               }
           })
       }
   })


            }
           
        }
        else{
            res.json({status:0,message:'Failed! Invalid Mobile Number OR your account has been inactive'})
        }
    })

})



module.exports = router;