var express = require("express");
var mongoose = require("mongoose");
var cors=require('cors')
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

var ConnString =
  "mongodb+srv://ankur:Nanwani0885522@cluster0.sdtwr.mongodb.net/Feedback_Assignment?retryWrites=true&w=majority";
mongoose.connect(ConnString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "error"));
db.once("open", () => {
  console.log("connected to db");
});

const feedSchema = new mongoose.Schema({
  name: String,
  suggestion: String,
  date: {
    type: Date,
    default: Date.now
  },
  likes: Number,
  dislikes: Number
});

let Feed = mongoose.model("Feeds", feedSchema);


async function getAllFeeds() {
  const feeds = await Feed.find();
  return {status : 200,data:feeds}
}

app.get("/getallfeeds", (req, res) => {
  //createUser();
  let x=getAllFeeds()

  x.then(rs=>{
    res.send(rs)
  })
});


async function createUser(name,suggestion) {
  let newfeed = new Feed({
    name: name,
    suggestion:suggestion,
    likes: 0,
    dislikes: 0
  });
  let result = await newfeed.save();
  if(result._id !=null || result !="")
  {
    return ({status:true})
  }else{
    return ({status:false})
  }
}

app.post("/createfeed",(req,res)=>{
  let name=req.body.name
  let suggestion=req.body.suggestion
  let x=createUser(name,suggestion)
  x.then(output=>{
    res.send(output)
  })
})

async function updatefeed(id,type,count){
  let feed=await Feed.findById(id)
  if(!feed) return {status:false}
  
  if(type==='like')   feed.likes=count
  if(type==='dislike') feed.dislikes=count
  
  const result =await feed.save()
  if(result._id !=null || result !="")
  {
    return ({status:true})
  }else{
    return ({status:false})
  }
}

app.post("/updatefeed",(req,res)=>{
  let id=req.body.feedid
  let type=req.body.type
  let count=req.body.count
  let r=updatefeed(id,type,count)
  r.then(output=>{
    res.send(output)
  })
})

app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("connected to server");
});
