"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Link from 'next/link';


export default function Home() {
   const [serviceData, setServiceData] = useState([]);


   useEffect(() => {
       const fetchServiceData = async () => {
           try {
               const response = await fetch('/api/service_items');
               if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
               }
               const data = await response.json();
               setServiceData(data);
           } catch (error) {
               console.error('Error fetching service data:', error);
               // Optionally, you can set an error state or display an error message to the user
           }
       };


       fetchServiceData();
   }, []);


   return (
       <div>
           <h1>service Places</h1>
           <ul>
               {serviceData.map((item) => (
                   <li key={item.id}>
                       <Link href={`/service_places/service_items/${item.id}`}>{item.name}</Link>
                       <br></br>
                       <Link href={`/service_places/service_items/${item.id}`}>{item.description}</Link>
                       <br></br>
                       <Link href={`/service_places/service_items/${item.id}`}>{item.image}</Link>
                       <br></br>
                       <Link href={`/service_places/service_items/${item.id}`}>{item.directionLink}</Link>
                       <br></br>
                       <Link href={`/service_places/service_items/${item.id}`}>{item.openHours}</Link>
                       <br></br>
                       <br></br>


                   </li>
               ))}
           </ul>
       </div>
   );
}
