const express = require('express')
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const Post = require ('./Model/Post')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const SecretKey = "AK12345";

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/uploads',express.static('uploads'))


const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000" 
  };
  app.use("*", cors(corsOptions));

  const databaseserver = "127.0.0.1:27017"
const databasedb = "image-appDB"

mongoose.connect(`mongodb://${databaseserver}/${databasedb}`)
  .then(() => console.log('Connected!'));
 
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })




  app.post('/post-create', upload.single('image'), async function (req, res) {
    
    console.log(req.file,req.body,46);
    try {
      const postData = new Post({
        title:req.body.title,
        subject:req.body.subject,
        image: req.file.path
    })
  
    const post = await postData.save();
    res.status(200).json({ message:"You successfully created your post", data:post});
      
    } catch (error) {
      res.status(401).json({ message:error});
    }
    
  })



  app.get('/all-posts', async function (req, res) {
    try {
      const posts = await Post.find().select("title subject image").populate("user_id", "username email").sort({"createdAt": -1})
      // console.log(posts);
      res.status(200).json({ message:"You successfully created your posts", data:posts});
      
    } catch (error) {
      res.status(401).json({ message:error});
    }
    
  })

  

   app.post('/token-verify', async function (req, res) {
    try {
      const decryptData= jwt.verify(req.body.token, SecretKey)
      res.status(200).json({ message:"decrypt Data.", data:decryptData});
    } catch (error) {
      res.status(200).json({ message:error});
    }
   })
 
const port = 8000
app.listen(port,()=>{
    console.log(`Server running in this ${port}`);
})