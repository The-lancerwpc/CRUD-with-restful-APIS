const express = require("express");
const aap=express();
const port=8080;
const path= require("path");
//for unique id 
const{v4:uuidv4}=require('uuid');

//For post to patch/delete
const methodoverride = require("method-override");
aap.use(methodoverride("_method"));


//to accept all format data whether that is xml or json or url encoded line no:-7
aap.use(express.urlencoded({extended:true}))

//if u dont define ln.no-11&12  if you perform some operation and get back it may throw error

aap.set("view engine","ejs");
aap.set("views",path.join(__dirname,"views"));

//.use
aap.use(express.static(path.join(__dirname,"public")));

//public folder for css,html,js or header files , public is bydefault name
//js searches for
//To serve static files such as images, CSS files, and JavaScript files, use the express.static 
// a built-in middleware function in Express.

// For example, CSS stylesheets are static content;
//  they can be hosted as a file download,
//   and they're the same for each user

let posts=[
    //here we uses let bcz you cant dlt if u use const
    { id:uuidv4(),
      username:"sid1",
       content:"weekend is for pushing hard"
    },
    {
     id:uuidv4(),
      username:"sid2",
      content:"god is great all the time"
    },
    {
           id:uuidv4(),
      username:"sid3",
      content:"dream big"
    }
    ];




aap.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts})//render is used to send a file and send the above posts array to index.ejs file for further use
});

//for new post
aap.get("/posts/new",(req,res)=>{
     res.render("new.ejs");//in get request we get data in query
})

//after submitting,, push to array and post to posts page(main page)
//if a post request comes to /posts
//when post request comes to main page
aap.post("/posts",(req,res)=>{
    console.log(req.body);//in post request we get data in body so req.body
     //req.body will be printed in terminal
     let{username,content}=req.body;
     let id=uuidv4();//for unique id
     //adding the new post to the array
     posts.push({id,username,content});
     //now send a req to 8080/posts to see new posts
     //we will add res.redirect to do that automatically
      
     res.redirect("/posts");
    })
//if get request comes to /posts/:id
//search in id and get detailed posts
aap.get("/posts/:id",(req,res)=>{
let {id}=req.params;//params will return the id from url parameter (:id) , //use (:) for parameter
//now find the id from posts array
//for each p find id if match store in post
let post=posts.find((p)=>id === p.id)
res.render("show.ejs",{post});//sending to show file
});

 //to update our content
 //when patch req comes to id route
 aap.patch("/posts/:id",(req,res)=>{
let{id}=req.params;
let newcontent=req.body.content;//TEXTAREA name="content"
let post=posts.find((p)=>id === p.id);
post.content=newcontent;
console.log(post);
res.redirect("/posts");
});

aap.get("/posts/:id/edit", (req, res)=>{
    let{id}=req.params;
    let post=posts.find((p)=>id === p.id);
    res.render("edit.ejs",{post});
});
//if dlt request comes to /posts/:id
aap.delete("/posts/:id",(req,res)=>{
    let {id} = req.params;
    //filter and store all the id in our original
    //post array whose id is not equals to
    //our current id
     posts = posts.filter((p)=>id !== p.id);
    //res.send("delete success");
    res.redirect("/posts");
});

aap.listen(port,()=>{
    console.log("listening on",port);
})