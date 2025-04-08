"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link from next/link


export default function leisureItemDetails() {
 const { id } = useParams(); // Use useParams to get the dynamic route parameter
 const [leisureItem, setLeisureItem] = useState(null);


 useEffect(() => {
   if (id) {
     const fetchLeisureItem = async () => {
       try {
         const response = await fetch(`/api/leisureItem/${id}`);
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         setLeisureItem(data);
       } catch (error) {
         console.error("Error fetching leisure item:", error);
       }
     };
     fetchLeisureItem();
   }
 }, [id]);


 if (!leisureItem) {
   return <p>Loading...</p>;
 }


 return (
   <div>
     <h1>{leisureItem.name}</h1>
     <p>Description: {leisureItem.description}</p>
     <p>
       Image:{" "}
       {leisureItem.image ? (
         <img src={leisureItem.image} alt={leisureItem.name} />
       ) : (
         "No image available"
       )}
     </p>
     <p>
       Location Link:{" "}
       <Link href={leisureItem.directionLink}>{leisureItem.directionLink}</Link>
     </p>
     <p>Open Hours: {leisureItem.openHours}</p>
   </div>
 );
}
