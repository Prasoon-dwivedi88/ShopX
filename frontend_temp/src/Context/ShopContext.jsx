import React, { createContext, useEffect, useState } from "react";
//import all_product from '../Components/Assests/all_product'
//import CartItems from "../Components/CartItems/CartItems";

export const ShopContext = createContext(null);
const getDefaultCart=()=>{
         let cart={}
         for (let index = 0; index < 300+1; index++) {
             cart[index]=0;
         }
         return cart;
//         const cart = {};
//   all_product.forEach((item) => {
//     cart[item.id] = 0; // ✅ use actual product IDs
//   });
  return cart;
    }
const ShopContextProvider = (props) =>{
    const [all_product,setAll_Product]=useState([]);
    const [cartItems,setCartItems]=useState(getDefaultCart);
    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))
        //when the e commerce webpage will be loaded in that case all products will be fetched and if auth token is available when we r logged in in that case cartdata will be fetched from database and it will be saved in ShopContext..using that we'll update cartitems in cart page
        //linking getcart api with frontend now
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}` ,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(),
            }).then((response)=>response.json())
              .then((data)=>setCartItems(data))
        }
    },[])


    const addToCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            //if has auth token means we r logged in..so we'll update item id in mongodb database
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                     Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    const removeFromCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        //linking removefromcart functionality endpoint to frontend
        //same logic as above addtocart just change the endpoint
        if(localStorage.getItem('auth-token')){
            //if has auth token means we r logged in..so we'll update item id in mongodb database
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                     Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo=all_product.find((product)=>product.id===Number(item))
                totalAmount+=itemInfo.new_price* cartItems[item];
            }
        }
        return totalAmount;
    }
    const getTotalCartItems=()=>{
        let totalItem=0;
        for( const item in cartItems){
            if(cartItems[item]>0){
                totalItem+=cartItems[item]
            }
        }
        return totalItem;
    }
    const contextValue={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart}
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export  default ShopContextProvider;