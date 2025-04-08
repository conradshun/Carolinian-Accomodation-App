"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';


export default function Home() {
   const [foodData, setFoodData] = useState([]);


   useEffect(() => {
       const fetchFoodData = async () => {
           try {
               const response = await fetch('/api/food_items');
               if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
               }
               const data = await response.json();
               setFoodData(data);
           } catch (error) {
               console.error('Error fetching food data:', error);
               // Optionally, you can set an error state or display an error message to the user
           }
       };


       fetchFoodData();
   }, []);


   return (
       <div>
           <h1>Food Places</h1>
           <ul>
               {foodData.map((item) => (
                   <li key={item.id}>
                       <Link href={`/food_places/food_items/${item.id}`}>{item.name}</Link>
                       <br></br>
                       <Link href={`/food_places/food_items/${item.id}`}>{item.description}</Link>
                       <br></br>
                       <Link href={`/food_places/food_items/${item.id}`}>{item.image}</Link>
                       <br></br>
                       <Link href={`/food_places/food_items/${item.id}`}>{item.directionLink}</Link>
                       <br></br>
                       <Link href={`/food_places/food_items/${item.id}`}>{item.openHours}</Link>
                       <br></br>
                       <br></br>


                   </li>
               ))}
           </ul>
       </div>
   );
}
