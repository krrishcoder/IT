const http = require('http')
const fs = require("fs");

const qs = require('querystring');
const sql = require('mysql');

//------------------------------------------------db----------------------------------
const conn = sql.createConnection({
  host:"localhost",
  user :"krrishcoder",
  password:"root",
  database:"mydb"

})


 conn.connect((err)=>{

  if(err){
    console.log("db error ",err)
  }else{
    console.log("db connected")

  }
})
//---------------------------------------------------------------------------











const port=10000;

const server = http.createServer((req,res)=>{
  



  if(req.url =='/'){
    loadIndex(res)

  }else if(req.url == '/signin'){
  
    loadSignin(req,res)


  }else if(req.url == '/signup'){

    loadSignUp(req,res)

  }else if(req.url =='/welcome'){

    res.write("welcome");
    res.end();

  }else if(req.url == '/signinerror'){

    res.write("error in sign in");
    res.end();

  }
 


})

//----------------------------------------------------------------------------
server.listen(port,function(err){
  if(err){
    console.log("Something went wrong"+err);
  }
  else{
    console.log("listeneings")
  }
})
//-----------------------------------------------------------------------



function loadIndex(res){

  fs.readFile("abx.html",function(err,data){

    if(err){
      res.write("error 404")
      res.end()
  
    }else{
      res.write(data) 
      res.end()
    }
  
  })


}


////////////////////////////////////////////////////////////////////////////


function loadSignin(req,res){

// body --> username , password  --> match to db  send some text to user

var body ="";

req.on('data',(chunk)=>{
  body += chunk;
})

req.on('end',()=>{

  var paras = qs.parse(body);

  var q = 'select * from students where username = ? and password = ?';

  conn.query(q,[paras.username, paras.password],(err,data)=>{

    if(err){

      res.writeHead(302,{'Location':'/signinerror'})

      res.end()

    }else{
      console.log("dsgg",data.length)

      if(data.length==0){

        res.writeHead(302,{'Location':'/signinerror'})

        res.end()
      }else{

        res.writeHead(302,{'Location':'/welcome'})

        res.end()

      }
    }
   
  })



})
 


}






function loadSignUp(req,res){  //body --> username , name, password  -->  SQL

 

  var body =""
  req.on('data',(chunk)=>{
      body += chunk;
  })

  req.on('end',()=>{  /// sara data , body me aa gyi

    var student = qs.parse(body);

    var q = 'insert into students values(?,?,?)';

    conn.query(q, [student.username, student.name, student.password] ,(err,data)=>{

      if(err){
       
        //to redirect to home page
        res.writeHead(302,{'Location':'/welcome'})

         res.end()
        
      }else{
        
       //to redirect to home page
        res.writeHead(302,{'Location':'/welcome'})
        res.end()
      }

    })

  

  })
  
 
 


}
