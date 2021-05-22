var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

async function createUser() {
  let newfeed = new Feed({
    name: "ankur",
    likes: 10,
    dislikes: 5
  });
  let result = await newfeed.save();
  console.log(result);
}
async function getAllFeeds() {
  const feeds = await Feed.find();
  return {status : 200,data:feeds}
}

app.get("/ankut", (req, res) => {
  //createUser();
  let x=getAllFeeds()

  x.then(rs=>{
    res.send(rs)
  })
});

app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("connected to server");
});
