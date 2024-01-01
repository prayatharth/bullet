const express= require("express");
const bodyParser =require("body-parser");
const mongoose=require("mongoose");
const md5 = require('md5');
// const bcrypt = require("bcrypt");
// const saltRounds=10;

const session = require("express-session");
const passport= require("passport");
const passportLocalMongoose = require("passport-local-mongoose")



const status="";

const app=express();


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret: "prayahthjfj jkdjd kk343242",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));


app.use(passport.initialize());
app.use(passport.session());

///////////connect to db///////
mongoose.connect("mongodb://localhost:27017/bullet");
// mongoose.set("useCreateIndex",true);

//////////User Schema /////
const userSchema= new mongoose.Schema({
    cid: Number,
    name: String,
    email: String,
    password: String
});




const foodSchema = new mongoose.Schema({

    "name": String,
    "Type": [
      "Half",
      "Full"
    ],
    "prices": [
      {
        "Half": Number,
        "Full": Number
      }
    ],
    "category": String,
    "image": String,
    "description": String
});


userSchema.plugin(passportLocalMongoose);


//////////Model User//////////
const User =  new mongoose.model("User",userSchema); 
const Food = mongoose.model("Food",foodSchema,"foods");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());








//////get routes/////////
app.get("/",function(req,res){
    Food.find({}).then((f)=>{
       
        res.render("index",{userStatus: status, newItem: f,tot:0 });
    
        }).catch((err)=>{
            console.log(err);
        })
})
app.get("/index",function(req,res){
    Food.find({}).then((f)=>{
       
        res.render("index",{userStatus: status, newItem: f,tot:0 });
    
        }).catch((err)=>{
            console.log(err);
        })
});
app.get("/contact",function(req,res){
    res.render("contact",{userStatus: status});
});

app.get("/service",function(req,res){
    res.render("service",{userStatus: status});
});
app.get("/menu",function(req,res){


 
        Food.find({}).then((f)=>{
       
            res.render("menu",{userStatus: status, newItem: f,tot:0,userName:"kl" });
        
            }).catch((err)=>{
                console.log(err);
            });
            
        });

        

app.get("/about",function(req,res){

    if(req.isAuthenticated()){
    res.render("about",{userStatus: status});
}
else{
    res.redirect("/signin");
}



});


app.get("/testimonials",function(req,res){
    res.render("testimonials",{userStatus: status});
});

app.get("/booking",function(req,res){

    res.render("booking",{userStatus: status});

});


app.get("/signin",function(req,res){

    res.render("signin",{userStatus: status});

});

////////////////////////////BOOKING or REGISTER //////////////////////////////////////

app.post("/booking",function(req,res){
    
   
   User.register({username: req.body.cid}, req.body.password,function(err,user){

    if(err){
       

        console.log(err);
        res.render("booking",{userStatus: "Already Registered !"});
    }else{
        

        res.redirect("/signin");
        passport.authenticate("local",function(req,re){
            // Food.find({}).then((f)=>{
       
            //     res.render("menu",{userStatus: status, newItem: f,tot:0 });
            
            //     }).catch((err)=>{
            //         console.log(err);
            //     });

            res.redirect("/about");
        });
    }
   })
   
   
   
    // bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    
    //     const newUser = new User({
    
    //         cid: req.body.cid,
    //         name: req.body.fname+" "+req.body.lname,
    //         email: req.body.username,
    //         password: hash
    
    //     });
    //     const cid= req.body.cid;

    //     User.findOne({cid:cid})
    //     .then((foundUser)=>{ 
            
    //         res.render("signin",{userStatus : "Already Registered !"});
    //     })
       



        
    //     newUser.save()
    //       .then(()=>{console.log("success");
    //         res.render("signin",{userStatus : "Successfully Registered"});
            
    //         })
    //       .catch((err)=>{
            
    //         console.log(err);
    //     });
    
    //   });
      
    

});


////////////////////////////SIGNIN//////////////////////////////////////


app.post("/signin",function(req,res){

const user = new User({
    username: req.body.cid,
    password: req.body.password
});

req.login(user,function(err){
    if(err)
    {   
        console.log(err);
        res.redirect("/signin");
    }else{
       
        passport.authenticate("local",function(req,re){
                     
            // Food.find({}).then((f)=>{
       
            //     res.render("menu",{userStatus: status, newItem: f,tot:0 });
            
            //     }).catch((err)=>{
            //         console.log(err);
            //     });
            console.log("authenticate mein aaya");
            res.redirect("/about");
        });
}

});




//     const cid =req.body.cid;
//     const password =req.body.password;


//     User.findOne({cid:cid})
//     .then((foundUser)=>{ 
//         bcrypt.compare(password,foundUser.password,function(err,result)
//         {
//             if(result ==true){
//                 res.redirect("/menu");

//             }
//  else{   
//         res.render("signin",{userStatus : " Wrong password or id "})
//         console.log("auth failed");
  
//  }
//     })
// }).catch((err)=>{
//     console.log(err);})



});


app.post("/menu",function(req,res){

console.log(req.body);



});




app.listen(3000,()=>{console.log("running")});
