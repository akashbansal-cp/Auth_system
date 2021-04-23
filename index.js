const {Auth, LoginCredentials} = require('two-step-auth')
const express = require("express")
app = express()
const mysql = require('mysql')
app.use(express.json());

let err_msg='Some Error Occurred\n Please try again later. \n Or contact me bugs_authapp@gmail.com';
LoginCredentials.mailID='akashb.1233@gmail.com';
LoginCredentials.password='A@kash1507';
LoginCredentials.use=true;

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'auth_data',
});
connection.connect((err)=>{
    if(!err){
        console.log('Connected');
    }
    else{
        console.log(err.message);
        console.log('Connection failed');
    }
});

app.get('/',(req,res)=>{
    res.send("Welcome to the Authentication system")
})

app.post('/sign_up',(req,res)=>{
    connection.query(`INSERT INTO user_data (user_name,h_pass,login) VALUES ('${req.body.user}','${req.body.pass}',false);`,(err,row,files)=>{
        if(!err){
            res.send('User has been successfully Created');
        }
        else{
            console.log(err.message);
            if(err.message.includes('Duplicate')){
                res.send('User Already Exists');
            }
            else{
                res.status(400).send(err_msg)
            }
        }
    });
})

app.get('/login',(req,res)=>{
    connection.query(`select  * from user_data where user_name='${req.body.user}' and h_pass='${req.body.pass}';`,(err,rows,files)=>{
        if(!err){
            if(rows.length==1){
                connection.query(`update user_data set login=true where user_name = '${req.body.user}';`)
                res.send('User Logged In');
            }
            else{
                res.send('User Not found');
            }
        }
        else{
            console.log(err);
            res.status(400).send(err_msg)
        }
    })
})

app.get('/logout',(req,res)=>{
    connection.query(`Select * from user_data where user_name = '${req.body.user}';`,(err,rows,files)=>{
        if(!err){
            if(rows.length==1){
                connection.query(`update user_data set login = false where user_name = '${req.body.user}';`);
                res.send('User Successfully Logged Out');
            }
            else{
                res.send('User Not Found');
            }
        }
        else{
            console.log(err.message);
            res.status(400).send(err_msg);
        }
    })
})

app.get('/users',(req,res)=>{
    connection.query('Select * from user_data',(err,rows,files)=>{
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err.message);
            res.status(400).send(err_msg);;
        }
    })
})

app.listen(5000)