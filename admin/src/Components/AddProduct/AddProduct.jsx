import React from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'
const AddProduct = () => {
    //logic for displaying image in upload section
    const [image,setImage]=useState(false);
    //and we have to make add product functional to add product in our database
    const [productDetails,setProductDetails]=useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })
    const imageHandler =(e)=>{
        setImage(e.target.files[0])
    }
    const changeHandler=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }
    const Add_Product=async ()=>{
        console.log(productDetails);
        //we have to connect our add product page to backend..so we have to
        //establish logic for add product function using that when we click on 
        //button that data will be sent to backend and display a message in response on this webpage

        //we will upload our image on upload end-point so that our image will be uploaded add we get the image URL
        //using that url we can save our image in mongodb databse
        let responseData;
        let product=productDetails;

        let formData=new FormData();
        formData.append('product',image);//product is the fieldname

        await fetch('https://shopx-5097.onrender.com/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data})//saving parsed data in responsedata that we got by promise
        if(responseData.success){
        product.image=responseData.image_url;
        console.log(product);
        //send this product to add product end point 
        await fetch ('https://shopx-5097.onrender.com/addproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(product),
        }).then((resp)=>resp.json()).then((data)=>{
            data.success?alert("Product Added"):alert("Failed")
        })
        }
    }
    

  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type here'/>
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type here'/>
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type='text' name='new_price' placeholder='Type here'/>
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} alt="" className="addproduct-thumbnail-img" />
                {/*if the image is true it will display the uplaoded image else display default upload area image */}
            </label>
            <input onChange={imageHandler} type='file' name='image' id='file-input' hidden/>
        </div>
        <button onClick={()=>{Add_Product()}}className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct