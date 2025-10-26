const port=4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const { error } = require("console");
const { type } = require("os");

app.use(express.json());
app.use(cors());
// database connection with mongodb
mongoose.connect("mongodb+srv://prasoondwivedi884_db_user:DmrsCntZpB3ZxZmP@cluster0.pkcum5u.mongodb.net/e-commerce")
//API creation
app.get("/",(req,res)=>{
    res.send("Express app is running")
})
//Image storage engine (using disk storage using multer)
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload=multer({storage:storage})
//creating upload endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})
//schema for creating products
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  //description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required:true },
  old_price: { type: Number , required:true},
  date: { type: Date, default: Date.now },
  avilable: { type: Boolean, default: true },
});
// Create an endpoint for adding products using admin panel
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
     id = last_product.id + 1;
  }
  else { id = 1; }
  const product = new Product({
    id: id,
    name: req.body.name,
    //description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name })
});
//creating api for deleting products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name })
});
//creating api for getting all. products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products fetched");
  res.send(products);
});
//now we will create multiple api such as for user creation,login and saving the cart items in the database
//(1)schema creating for user model
const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
//creating api using that we will create the user(creating endpoint for registering the user)
app.post('/signup',async(req,res)=>{
    //checking email and password
    let check=await Users.findOne({email:req.body.email})
    if(check){
        //status 400 indicate bad http request
        return res.status(400).json({
            success:false,
            errors:"existing user found with same email address"
        })
    }
        //create empty cart for user
        let cart={};
        for(let i=0;i<300;i++){
            cart[i]=0;
        }
        //create new user
        const user=new Users({
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,//we'll talk about password hashing
            cartData:cart,
        })
        await user.save();//saving user in database
        //now using jwt authentication
        //first we'll create one data...this is creating payload..data to include in jwt
        const data={
            user:{
                id:user._id//earlier it was id:user.id
            }
        }
        //creating token...then using salt our data will be encrypted by one layer(will not be readable)
        const token=jwt.sign(data,'secret_ecom');
        //after creating token we'll create one response
        res.json({success:true,token}) 
})
//creating endpoint for user login
app.post('/login',async (req,res)=>{
    //first we'll use email address we will get from the api..we'll get user related to particular email id and store in user
    let user= await Users.findOne({email:req.body.email})
    if(user){
        //compare user password and password we r getting from api
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user._id//earlier it was id:user.id
                }
            }
            //again jwt authentication..genrate token and response
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        //if this user is not available with this email id
        res.json({success:false,errors:"Wrong Email Id"});
    }
})
//creating endpoint for new collection data
app.get('/newcollections',async (req,res)=>{
    let products=await Product.find({});//storing products from database
    let newcollections=products.slice(1).slice(-8);//slicing products array to get recently added 8 products..adding newly added products in new collections
    console.log("New Collection Fetched");
    res.send(newcollections);
})
//creating endpoint for popular in women section
app.get('/popularinwomen', async (req,res)=>{
    let products=await Product.find({category:"women"});//finding and storing women category products
    let popular_in_women=products.slice(0,4);
    console.log("Popular in Women fetched");
    res.send(popular_in_women);
})
//creating middleware to fetch user using auth token
const fetchUser =async(req,res,next)=>{
    //we'll take the auth token verufy that and find the user
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            //now we'll decode the token and we'll access the user data in our request
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }
        catch(error){
            res.status(401).send({errors:"Please authenticate using a valid token"})
        }
    }
}
//creating endpoint for adding products in cart data
app.post('/addtocart', fetchUser , async (req,res)=>{
    console.log("added",req.body.itemId);
    //we'll use this user id to find the user  
    //console.log(req.body,req.user);
    let userData=await Users.findOne({_id:req.user.id})
    //now modify the cart data
    userData.cartData[req.body.itemId]+=1;
    //save in database
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})
//creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req,res)=>{
    console.log("removed",req.body.itemId);
    //almost same logic as addtocart endpoint just decrement(with a condition applied) instead of incrementing
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId]-=1;
    } 
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");
})
//creating endpoint to retrieve cartdata for a user
app.post('/getcart',fetchUser, async (req,res)=>{
    //using user's id we'll find its cartdata
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port "+port);
    }else{
        console.log("Error :"+error)
    }
})
