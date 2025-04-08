"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link from next/link


export default function serviceItemDetails() {
 const { id } = useParams(); // Use useParams to get the dynamic route parameter
 const [serviceItem, setServiceItem] = useState(null);


 useEffect(() => {
   if (id) {
     const fetchServiceItem = async () => {
       try {
         const response = await fetch(`/api/service_items/${id}`);
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         setServiceItem(data);
       } catch (error) {
         console.error("Error fetching service item:", error);
       }
     };
     fetchServiceItem();
   }
 }, [id]);


 if (!serviceItem) {
   return <p>Loading...</p>;
 }


 return (
   <div>
     <h1>{serviceItem.name}</h1>
     <p>Description: {serviceItem.description}</p>
     <p>
       Image:{" "}
       {serviceItem.image ? (
         <img src={serviceItem.image} alt={serviceItem.name} />
       ) : (
         "No image available"
       )}
     </p>
     <p>
       Location Link:{" "}
       <Link href={serviceItem.directionLink}>{serviceItem.directionLink}</Link>
     </p>
     <p>Open Hours: {serviceItem.openHours}</p>
   </div>
 );
}
