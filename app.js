
const mysql= require('mysql2');
const express = require('express');
const bodyparser = require('body-parser');
const { urlencoded } = require('body-parser');
var app = express();
app.use(bodyparser.json());
urlencodedparser =bodyparser.urlencoded({extended:false});


app.listen(3000); // server


app.set('view engine','ejs');  //setting ejs

//create connection

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'safiair'
});

//connect
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log('well connected');
});



app.get('/',(req,res)=>{
    res.render('index')
    
})
app.get('/reservation',(req,res)=>{
    res.render('reservation')
})
app.get('/locations',(req,res)=>{
    res.render('locations')
})
//reservation
app.get('/flights' , (req, res) => {
   
    db.query('SELECT * FROM flight', (err, rows, fields) => {
    if (!err){
        res.render('reservation',{rows});
        
    }
    
    else
    console.log(err);
    })
    } );


    app.post('/specific',urlencodedparser,(req,res)=>{
        var from = req.body.from;
        var where = req.body.where;
        var flight_date = req.body.flightdate;
        db.query(`SELECT * FROM flight WHERE departure = '${from}' AND destination ='${where}' and dep_date = '${flight_date}' `, (err, specificflight, fields) => {
            if (!err){
                res.render('locations',{specificflight});
                console.log(specificflight);  
            } 
            else
            console.log(err);
            });
    })

    app.post('/booking',urlencodedparser,(req,res)=>{
        let booking_id = req.body.flight_id;
        let extra = req.body.extra;
        let name = req.body.fullname;
        let mail = req.body.email
        db.query(`INSERT INTO reservation (vol_id,Extra,full_name,mail) VALUES ('${booking_id}', '${extra}','${name}','${mail}')`,(err,result)=>{
            if(!err){
                res.render('index');
            }else{
                console.log(err);
            }
        });   
    });



// add 404 page
app.use((req,res)=>{
    res.status(404).render('404')
})