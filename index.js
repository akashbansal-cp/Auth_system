const bcrypt = require('bcrypt')
const req_sal=10
const express = require("express")
const mysql = require('mysql')
const {Validator}=require('node-input-validator')


app = express()
app.use(express.json());

let err_msg='Some Error Occurred\n Please try again later. \n Or contact me bugs_authapp@gmail.com';

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
    const sign_up_validator = new Validator(req.body,{
        email:'required|email',
        pass:'required|minLength:5',
        user:'required|minLength:5|maxLength:35|alphaNumeric',
        name:'required|minLength:5|maxLength:35|alphaNumeric'
    });
    sign_up_validator.check().then((matched)=>{
        if(matched){
            bcrypt.hash(req.body.pass,req_sal,(e,hash)=>{
                if(!e){
                    connection.query(`INSERT INTO user_data (user_name,h_pass,login) VALUES ('${req.body.user}','${hash}',false);`,(err,row,files)=>{
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
                }
                else{
                    console.log(e.message);
                    res.send(err_msg);
                }
            })
        }
        else{
            res.status(422).send(sign_up_validator.errors);
        }
    })

})

app.get('/login',(req,res)=>{
    const login_validator = new Validator(req.body,{
        user:'required|minLength:5|maxLength:35|alphaNumeric',
        pass:'required|minLength:5'
    });
    login_validator.check().then((matched)=>{
        if(matched){
            connection.query(`select  * from user_data where user_name='${req.body.user}';`,(err,rows,files)=>{
                if(!err){
                    if(rows.length==1){
                        bcrypt.compare(req.body.pass,rows[0]['h_pass'],(e,result)=>{
                            if(result==true){
                                connection.query(`update user_data set login=true where user_name = '${req.body.user}';`)
                                res.send('User Logged In');
                            }
                            else{
                                res.send('Wrong Password');
                            }
                        })
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
        }
        else{
            res.status(422).send(login_validator.errors);
        }
    })
})

app.get('/logout',(req,res)=>{
    const logout_validator  = new Validator(req.body,{
        user:'required|minLength:5|maxLength:35|alphaNumeric'
    });
    logout_validator.check().then((matched)=>{
        if(matched){
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
        }
        else{
            res.status(422).send(logout_validator.errors);
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

app.get('/delete',(req,res)=>{
    const delete_validator = new Validator(req.body,{
        user:'required|minLength:5|maxLength:35|alpheNumeric',
        pass:'required|minLength:5'
    })
    delete_validator.check().then((matched)=>{
        if(matched){

            connection.query(`select * from user_data where user_name = '${req.body.user}';`,(err,rows,files)=>{
                if(!err){
                    if(rows.length==1){
                        bcrypt.compare(req.body.pass,rows[0]['h_pass'],(e,result)=>{
                            if(result==true){
                                connection.query(`delete from user_data where user_name = '${req.body.user}';`);
                                res.send('User Deleted successfully');
                            }
                            else{
                                res.send('Wrong Password Detected');
                            }
                        })
                    }
                    else{
                        res.send('No such user found');
                    }
                }
                else{
                    console.log(err.message);
                    res.status(400).send(err_msg);
                }
            })
        }
        else{
            res.status(422).send(delete_validator.errors);
        }
    })
})
app.listen(5000)