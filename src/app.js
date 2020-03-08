const sql=require('mssql');
const express=require('express');
const ejs=require('ejs');
const path=require('path');
const app=express();
const bodyparser=require('body-parser');
const timestamp=require('time-stamp');
const port=process.env.port||3000;

const dirPath=path.join(__dirname,'../public');
const viewPath=path.join(__dirname,'../templates/views');

app.set('view engine','ejs');
app.set('views',viewPath);
app.use(express.static(dirPath));
//allow to access post data
app.use(bodyparser.urlencoded({extended:true}));

//config for database
const config={
    //getting value from config file
    user:'**',
    password:'*********',
    server:'*******',
    database:'******',
    options:{
        encrypt:false
    }
};

app.get('/',(req,res)=>{
    //read
    sql.connect(config,(error)=>{
        if(error){
            return console.log(error);
        }
        const request=new sql.Request()
    
        request.query('select * from project order by timestamp desc',(error,result)=>{
            if(error){
                return console.log(error);
            }
           //console.log(result.recordset.length);
           res.render('index',{layout:result});
        
        })
    })
  
})

app.get('/create',(req,res)=>{
    //create form
    res.render('postform');
})

app.post('/postform',(req,res)=>{  
    //create 
    const guid=CreateGuid();
    const language=req.body.txtLanguage;
    const programmer=req.body.txtProgrammer;
    const time=timestamp.utc('DD/MM/YYYY HH:mm:ss');
    
    //TODO:update logic
   //const result= executequery(`select * from project where language='${language}' and programmer='${programmer}'`);
    executequery(`insert into project values('${guid}','${language}','${programmer}','${time.toString()}')`);
    res.redirect('/?language='+language+'&programmer='+programmer);
})

app.post('/deleteform',(req,res)=>{
    //delete
    console.log(Object.keys(req.body)[0])
    const id=Object.keys(req.body)[0];
    executequery(`delete from project where id='${id}'`);
    res.redirect('/')
})

const executequery=(query)=>{
    //executing query
     sql.connect(config,(error)=>{
        if(error){
            return console.log(error);
        }
        const request=new sql.Request()
    
         request.query(query,(error,result)=>{
            if(error){
                return console.log(error);
            }          
           return console.log(result);
        })
    })
}

const CreateGuid=()=>{
    //genrate guid
    const _p8=(s)=>{
        var p=(Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-"+p.substr(0,4)+"-"+p.substr(0,4):p;
        }
        return _p8()+ _p8(true)+ _p8(true) +_p8();
    }

app.get('*',(req,res)=>{
    res.status(404).send();
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

