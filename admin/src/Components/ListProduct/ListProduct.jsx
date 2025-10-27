import React from 'react'
import './ListProduct.css'
import { useState } from 'react'
import { useEffect } from 'react';
import cross_icon from '../../assets/cross_icon.png'
const ListProduct = () => {
    const [allproducts,setAllProducts]=useState([]);
    //now a function from which we can fetch data from api and store it in this state variable
    const fetchInfo=async ()=>{
        await fetch('https://shopx-5097.onrender.com/allproducts')
        .then((res)=>res.json())
        .then((data)=>{setAllProducts(data)})
        //first parsing using res.json() then saved this data in allproducts state variable 
    }
    //we want to execute above function only once..when this component is mounted
    useEffect(()=>
        {fetchInfo()},
    []);
    //to make the cross icon functional
    const remove_product= async(id)=>{
        await fetch('https://shopx-5097.onrender.com/removeproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({id:id})
        })
        //we have to call fetchinfo function again after removing a product and updating the list
        await fetchInfo();
    }
  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old price</p>
            <p>New price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
            <hr/>
            {/* mapping the product data that we will get from api */}
            {allproducts.map((product,index)=>{
                return <>
                <div key={index} className="listproduct-format-main listproduct-format">
                    <img src={product.image} alt="" className="listproduct-product-icon" />
                    <p>{product.name}</p>
                    <p>${product.old_price}</p>
                    <p>${product.new_price}</p>
                    <p>{product.category}</p>
                    <img onClick={()=>{remove_product(product.id)}}src={cross_icon} alt="" className="listproduct-remove-icon" />
                </div>
                <hr/>
                </>
            })}
        </div>
    </div>
  )
}

export default ListProduct