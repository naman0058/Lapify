var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'repair';


router.get('/',(req,res)=>{
    if(req.session.adminid){
    res.render('repair')
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
    (select b.name from category b where b.id = s.brandid) as brandname
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
            res.redirect('/repair')
        }
    })
})


router.get('/all/enquiry/running',(req,res)=>{
    var query = `select e.* ,
    (select b.name from brand b where b.id = e.brandid) as brandname,
    (select p.name from parts p where p.id = e.partsid) as partsname,
    (select p.price from parts p where p.id = e.partsid) as partsprice,
    (select p.image from parts p where p.id = e.partsid) as partsimage
     from parts_enquiry e here e.status != 'completed' where order by id desc;`
     pool.query(query,(err,result)=>{
       if(err) throw err;
       else res.render('')
     })
})



router.get('/all/enquiry/history',(req,res)=>{
    var query = `select e.* ,
    (select b.name from brand b where b.id = e.brandid) as brandname,
    (select p.name from parts p where p.id = e.partsid) as partsname,
    (select p.price from parts p where p.id = e.partsid) as partsprice,
    (select p.image from parts p where p.id = e.partsid) as partsimage
     from parts_enquiry e here e.status = 'completed' where order by id desc;`
     pool.query(query,(err,result)=>{
       if(err) throw err;
       else res.json(result)
     })
})


module.exports = router;